import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Layout from '../components/Layout';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SERVICE_CATEGORIES } from '../types';
import { format, addDays } from 'date-fns';

interface AddLeadForm {
  business_name: string;
  contact_number: string;
  location: string;
  service_category: string;
  follow_up_date: string;
  follow_up_time: string;
  notes: string;
}

export default function AddLead() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<AddLeadForm>({
    defaultValues: {
      follow_up_date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      follow_up_time: '10:00',
      service_category: 'Web Development'
    }
  });

  const onSubmit = async (data: AddLeadForm) => {
    if (!isSupabaseConfigured() || !supabase) {
      alert("Please configure Supabase first.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('customers')
        .insert([
          {
            ...data,
            status: 'New Lead'
          }
        ]);

      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Error adding lead:', error);
      alert('Failed to add lead. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4 text-slate-400 hover:text-slate-600">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Add New Lead</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
            <input
              {...register('business_name', { required: 'Business name is required' })}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="e.g. Acme Corp"
            />
            {errors.business_name && <p className="text-red-500 text-xs mt-1">{errors.business_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
            <input
              type="tel"
              {...register('contact_number', { required: 'Phone number is required' })}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="+91 98765 43210"
            />
            {errors.contact_number && <p className="text-red-500 text-xs mt-1">{errors.contact_number.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
            <input
              {...register('location', { required: 'Location is required' })}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="e.g. Mumbai, Andheri"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Service Category</label>
            <select
              {...register('service_category')}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
            >
              {SERVICE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Follow-up Date</label>
              <input
                type="date"
                {...register('follow_up_date', { required: true })}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
              <input
                type="time"
                {...register('follow_up_time', { required: true })}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Any specific requirements..."
            />
          </div>
        </div>

        <div className="pt-4 pb-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center active:scale-95"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Save size={20} className="mr-2" />
                Save Lead
              </>
            )}
          </button>
        </div>
      </form>
    </Layout>
  );
}
