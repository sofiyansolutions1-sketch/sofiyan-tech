import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Customer } from '../types';
import { format } from 'date-fns';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (date: string, time: string) => void;
  currentDate?: string;
  currentTime?: string;
}

export default function RescheduleModal({ isOpen, onClose, onSave, currentDate, currentTime }: RescheduleModalProps) {
  const { register, handleSubmit } = useForm<{ date: string; time: string }>({
    defaultValues: {
      date: currentDate || format(new Date(), 'yyyy-MM-dd'),
      time: currentTime || format(new Date(), 'HH:mm'),
    }
  });

  if (!isOpen) return null;

  const onSubmit = (data: { date: string; time: string }) => {
    onSave(data.date, data.time);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800">Reschedule Follow-up</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">New Date</label>
            <input
              type="date"
              {...register('date', { required: true })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">New Time</label>
            <input
              type="time"
              {...register('time', { required: true })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-indigo-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
