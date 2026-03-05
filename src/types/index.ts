export type ServiceCategory = 'Web Development' | 'App Development' | 'Business Automation';

export type LeadStatus = 'New Lead' | 'Follow-up Pending' | 'Contacted' | 'Converted' | 'Not Interested';

export interface Customer {
  id: number;
  business_name: string;
  contact_number: string;
  location: string;
  service_category: ServiceCategory;
  follow_up_date: string; // YYYY-MM-DD
  follow_up_time: string; // HH:mm:ss
  notes?: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  'Web Development',
  'App Development',
  'Business Automation',
];

export const LEAD_STATUSES: LeadStatus[] = [
  'New Lead',
  'Follow-up Pending',
  'Contacted',
  'Converted',
  'Not Interested',
];
