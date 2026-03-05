import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Calendar, Clock, MapPin, Trash2, Edit, MessageCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Customer, LEAD_STATUSES } from '../types';
import { format, parseISO } from 'date-fns';
import RescheduleModal from '../components/RescheduleModal';

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);

  useEffect(() => {
    fetchLeadDetails();
  }, [id]);

  const fetchLeadDetails = async () => {
    if (!isSupabaseConfigured() || !supabase || !id) return;

    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setLead(data);
    } catch (error) {
      console.error('Error fetching lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!supabase || !lead) return;
    
    // Optimistic
    setLead({ ...lead, status: newStatus as any });

    await supabase
      .from('customers')
      .update({ status: newStatus })
      .eq('id', lead.id);
  };

  const handleReschedule = async (date: string, time: string) => {
    if (!supabase || !lead) return;

    setLead({ ...lead, follow_up_date: date, follow_up_time: time });

    await supabase
      .from('customers')
      .update({ follow_up_date: date, follow_up_time: time })
      .eq('id', lead.id);
  };

  const handleDelete = async () => {
    if (!supabase || !lead) return;
    if (!window.confirm('Are you sure you want to delete this lead?')) return;

    await supabase.from('customers').delete().eq('id', lead.id);
    navigate('/');
  };

  const getWhatsAppLink = (number: string) => {
    const cleanNumber = number.replace(/\D/g, '');
    return `https://wa.me/${cleanNumber}`;
  };

  if (loading) return <Layout><div className="p-8 text-center text-slate-500">Loading details...</div></Layout>;
  if (!lead) return <Layout><div className="p-8 text-center text-slate-500">Lead not found</div></Layout>;

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600 p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex gap-2">
          <button onClick={handleDelete} className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{lead.business_name}</h1>
          <div className="flex items-center text-slate-500">
            <MapPin size={16} className="mr-2 text-slate-400" />
            {lead.location}
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">Status</span>
              <select 
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="bg-transparent font-semibold text-slate-700 w-full focus:outline-none cursor-pointer"
              >
                {LEAD_STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">Service</span>
              <div className="font-semibold text-slate-700 truncate" title={lead.service_category}>{lead.service_category}</div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
              Follow-up Schedule
            </h3>
            <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              <div className="flex items-center">
                <div className="bg-indigo-100 p-2.5 rounded-lg mr-4 text-indigo-600">
                  <Calendar size={20} />
                </div>
                <div>
                  <div className="font-bold text-indigo-900">
                    {format(parseISO(lead.follow_up_date), 'EEEE, MMM d')}
                  </div>
                  <div className="text-indigo-600 text-sm mt-0.5 font-medium flex items-center">
                    <Clock size={12} className="mr-1" />
                    {lead.follow_up_time.substring(0, 5)}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsRescheduleOpen(true)}
                className="bg-white p-2 rounded-lg text-indigo-600 shadow-sm hover:bg-indigo-50 border border-indigo-100 transition-colors"
              >
                <Edit size={18} />
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notes</h3>
            <div className="bg-slate-50 p-4 rounded-xl text-slate-600 text-sm leading-relaxed min-h-[100px] border border-slate-100">
              {lead.notes || <span className="text-slate-400 italic">No notes added.</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-20 left-0 right-0 p-4 md:absolute md:bottom-0 bg-gradient-to-t from-white via-white to-transparent pb-6 pt-8">
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          <a
            href={`tel:${lead.contact_number}`}
            className="flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-slate-200 transition-transform active:scale-95"
          >
            <Phone size={20} className="mr-2" />
            Call
          </a>
          <a
            href={getWhatsAppLink(lead.contact_number)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-200 transition-transform active:scale-95"
          >
            <MessageCircle size={20} className="mr-2" />
            WhatsApp
          </a>
        </div>
      </div>

      <RescheduleModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        onSave={handleReschedule}
        currentDate={lead.follow_up_date}
        currentTime={lead.follow_up_time}
      />
    </Layout>
  );
}
