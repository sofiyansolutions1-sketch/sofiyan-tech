import React, { useEffect, useState } from 'react';
import { Search, Filter, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import LeadCard from '../components/LeadCard';
import RescheduleModal from '../components/RescheduleModal';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Customer } from '../types';
import { isToday, isPast, isFuture, parseISO, compareAsc } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [leads, setLeads] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [rescheduleLead, setRescheduleLead] = useState<Customer | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('follow_up_date', { ascending: true })
        .order('follow_up_time', { ascending: true });

      if (error) throw error;
      setLeads(data || []);
    } catch (err: any) {
      console.error('Error fetching leads:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: Customer['status']) => {
    if (!supabase) return;
    
    // Optimistic update
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l));

    const { error } = await supabase
      .from('customers')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      fetchLeads(); // Revert on error
    }
  };

  const handleReschedule = async (date: string, time: string) => {
    if (!rescheduleLead || !supabase) return;

    const updatedLead = { ...rescheduleLead, follow_up_date: date, follow_up_time: time };
    
    // Optimistic update
    setLeads(leads.map(l => l.id === rescheduleLead.id ? updatedLead : l));

    const { error } = await supabase
      .from('customers')
      .update({ follow_up_date: date, follow_up_time: time })
      .eq('id', rescheduleLead.id);

    if (error) {
      console.error('Error rescheduling:', error);
      fetchLeads(); // Revert on error
    }
  };

  // Filter leads
  const filteredLeads = leads.filter(lead => 
    lead.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.contact_number.includes(searchQuery) ||
    lead.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group leads
  const overdueLeads = filteredLeads.filter(l => {
    const date = parseISO(l.follow_up_date);
    return isPast(date) && !isToday(date) && l.status !== 'Converted' && l.status !== 'Not Interested';
  });

  const todayLeads = filteredLeads.filter(l => {
    const date = parseISO(l.follow_up_date);
    return isToday(date) && l.status !== 'Converted' && l.status !== 'Not Interested';
  });

  const upcomingLeads = filteredLeads.filter(l => {
    const date = parseISO(l.follow_up_date);
    return isFuture(date) && !isToday(date) && l.status !== 'Converted' && l.status !== 'Not Interested';
  });

  // Calculate stats
  const stats = {
    today: todayLeads.length,
    overdue: overdueLeads.length,
    total: leads.length
  };

  if (!isSupabaseConfigured()) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[80vh] text-center p-6">
          <div className="bg-indigo-50 p-4 rounded-full mb-4">
            <AlertCircle size={48} className="text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Setup Required</h2>
          <p className="text-slate-600 mb-6">
            Please connect your Supabase database to start managing leads.
          </p>
          <div className="bg-slate-900 text-slate-50 p-4 rounded-lg text-left text-sm w-full max-w-sm overflow-x-auto">
            <code className="block mb-2">1. Create Supabase Project</code>
            <code className="block mb-2">2. Get URL & Anon Key</code>
            <code className="block">3. Add to Secrets in AI Studio</code>
          </div>
          <Link to="/setup" className="mt-6 text-indigo-600 font-medium hover:underline">
            View Setup Instructions
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm text-center">
          <div className="text-2xl font-bold text-indigo-600">{stats.today}</div>
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Today</div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm text-center">
          <div className="text-2xl font-bold text-red-500">{stats.overdue}</div>
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Overdue</div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm text-center">
          <div className="text-2xl font-bold text-slate-700">{stats.total}</div>
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search leads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow shadow-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Overdue Section */}
          {overdueLeads.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-3 flex items-center">
                <AlertCircle size={14} className="mr-1.5" />
                Overdue Follow-ups
              </h2>
              {overdueLeads.map(lead => (
                <LeadCard 
                  key={lead.id} 
                  lead={lead} 
                  onStatusUpdate={handleStatusUpdate}
                  onReschedule={(l) => setRescheduleLead(l)}
                />
              ))}
            </section>
          )}

          {/* Today Section */}
          <section>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Today's Calls
            </h2>
            {todayLeads.length === 0 && (
              <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-200 mb-6">
                <p className="text-slate-400 text-sm font-medium">No calls scheduled for today.</p>
                <p className="text-slate-300 text-xs mt-1">Enjoy your day!</p>
              </div>
            )}
            {todayLeads.map(lead => (
              <LeadCard 
                key={lead.id} 
                lead={lead} 
                onStatusUpdate={handleStatusUpdate}
                onReschedule={(l) => setRescheduleLead(l)}
              />
            ))}
          </section>

          {/* Upcoming Section */}
          {upcomingLeads.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Upcoming
              </h2>
              {upcomingLeads.map(lead => (
                <LeadCard 
                  key={lead.id} 
                  lead={lead} 
                  onStatusUpdate={handleStatusUpdate}
                  onReschedule={(l) => setRescheduleLead(l)}
                />
              ))}
            </section>
          )}
        </div>
      )}

      <RescheduleModal
        isOpen={!!rescheduleLead}
        onClose={() => setRescheduleLead(null)}
        onSave={handleReschedule}
        currentDate={rescheduleLead?.follow_up_date}
        currentTime={rescheduleLead?.follow_up_time}
      />
    </Layout>
  );
}
