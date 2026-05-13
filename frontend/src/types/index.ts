export interface User {
  id: number;
  username: string;
  name: string;
  role: 'sales' | 'operations' | 'supplier' | 'admin';
}

export interface Order {
  id: number;
  order_number: string;
  sales_id: number;
  sales_name: string;
  travel_type: 'flight' | 'train';
  departure_city: string;
  arrival_city: string;
  departure_date: string;
  return_date?: string;
  passenger_name: string;
  passenger_phone: string;
  passenger_id_number: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected' | 'booked' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface BookingInfo {
  id: number;
  order_id: number;
  ticket_number: string;
  departure_time: string;
  arrival_time: string;
  seat_info?: string;
  booking_notes?: string;
  supplier_id: number;
  created_at: string;
}

export interface ChangeRequest {
  id: number;
  order_id: number;
  request_type: 'refund' | 'change' | 'cancel';
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requested_by: number;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: number;
  order_id: number;
  user_id: number;
  user_name: string;
  action: string;
  details?: string;
  created_at: string;
}

export interface OrderDetail extends Order {
  booking_info?: BookingInfo;
  activity_logs: ActivityLog[];
  change_requests: ChangeRequest[];
}

export interface Stats {
  pending?: number;
  approved?: number;
  booked?: number;
  completed?: number;
  total: number;
  pending_changes?: number;
  total_users?: number;
}
