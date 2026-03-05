import React from 'react';
import { format, parseISO, isToday, isPast } from 'date-fns';
import { Phone, Calendar, Clock, MapPin, MessageCircle } from 'lucide-react';
import { Customer, LeadStatus } from '../types';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export interface LeadCardProps {
  lead: Customer;
  onStatusUpdate: (id: number, status: LeadStatus) => void;
  onReschedule: (lead: Customer) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onStatusUpdate, onReschedule }) => {
  const followUpDate = parseISO(lead.follow_up_date);
  const isOverdue = isPast(followUpDate) && !isToday(followUpDate);
  const isDueToday = isToday(followUpDate);

  const getWhatsAppLink = (number: string) => {
    const cleanNumber = number.replace(/\D/g, '');
    return `https://wa.me/${cleanNumber}`;
  };

  const statusColors = {
    'New Lead': 'bg-blue-50 text-blue-700 border-blue-100',
    'Follow-up Pending': 'bg-amber-50 text-amber-700 border-amber-100',
    'Contacted': 'bg-purple-50 text-purple-700 border-purple-100',
    'Converted': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Not Interested': 'bg-slate-50 text-slate-600 border-slate-100',
  };

  return (
    <div className={cn(
      "bg-white border rounded-xl p-5 shadow-sm mb-4 transition-all hover:shadow-md",
      isOverdue ? "border-red-200 shadow-red-50" : "border-slate-200"
    )}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1">{lead.business_name}</h3>
          <div className="flex items-center text-slate-500 text-sm">
            <MapPin size={14} className="mr-1 text-slate-400" />
            {lead.location}
          </div>
        </div>
        <span className={cn(
          "text-[10px] uppercase font-bold px-2.5 py-1 rounded-full tracking-wide border",
          statusColors[lead.status] || 'bg-slate-50 text-slate-600 border-slate-100'
        )}>
          {lead.status}
        </span>
      </div>

      <div className="flex gap-3 mb-5">
        <div className={cn(
          "flex items-center text-sm px-3 py-1.5 rounded-lg border",
          isOverdue 
            ? "bg-red-50 text-red-700 border-red-100" 
            : isDueToday 
              ? "bg-indigo-50 text-indigo-700 border-indigo-100" 
              : "bg-slate-50 text-slate-600 border-slate-100"
        )}>
          <Calendar size={14} className="mr-2 opacity-70" />
          <span className="font-medium">
            {format(followUpDate, 'MMM d')}
          </span>
        </div>
        <div className="flex items-center text-sm px-3 py-1.5 rounded-lg border border-slate-100 bg-slate-50 text-slate-600">
          <Clock size={14} className="mr-2 opacity-70" />
          <span className="font-medium">
            {lead.follow_up_time.substring(0, 5)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-4">
        <a
          href={`tel:${lead.contact_number}`}
          className="flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-3 rounded-lg transition-colors active:scale-95 text-sm"
        >
          <Phone size={16} className="mr-2" />
          Call
        </a>
        <a
          href={getWhatsAppLink(lead.contact_number)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 px-3 rounded-lg transition-colors active:scale-95 text-sm"
        >
          <MessageCircle size={16} className="mr-2" />
          WhatsApp
        </a>
        <button
          onClick={() => onReschedule(lead)}
          className="flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium py-2.5 px-3 rounded-lg transition-colors active:scale-95"
          title="Reschedule"
        >
          <Clock size={18} />
        </button>
      </div>
      
      <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
         <Link to={`/lead/${lead.id}`} className="text-xs font-semibold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-wide">
            View Details
         </Link>
         <button 
            onClick={() => onStatusUpdate(lead.id, 'Contacted')}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-md hover:bg-indigo-50 transition-colors"
          >
            Mark Contacted
          </button>
      </div>
    </div>
  );
};

export default LeadCard;
