
import { supabase } from "@/integrations/supabase/client";

export interface Event {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  guests: number;
  chef_id: string | null;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  description: string | null;
  created_at: string;
  updated_at: string;
  chef?: {
    name: string;
    specialty: string;
  };
}

export interface CreateEventData {
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  guests: number;
  chef_id?: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  description?: string;
}

export const eventService = {
  async getAllEvents(): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        chef:chefs(name, specialty)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }

    return (data || []).map(event => ({
      ...event,
      status: event.status as 'pending' | 'confirmed' | 'completed' | 'cancelled'
    }));
  },

  async createEvent(eventData: CreateEventData): Promise<Event> {
    const { data: { user } } = await supabase.auth.getUser();
    
    const dataToInsert = {
      ...eventData,
      user_id: user?.id || null
    };

    const { data, error } = await supabase
      .from('events')
      .insert([dataToInsert])
      .select(`
        *,
        chef:chefs(name, specialty)
      `)
      .single();

    if (error) {
      console.error('Error creating event:', error);
      throw error;
    }

    return {
      ...data,
      status: data.status as 'pending' | 'confirmed' | 'completed' | 'cancelled'
    };
  },

  async updateEventStatus(id: string, status: Event['status']): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(`
        *,
        chef:chefs(name, specialty)
      `)
      .single();

    if (error) {
      console.error('Error updating event status:', error);
      throw error;
    }

    return {
      ...data,
      status: data.status as 'pending' | 'confirmed' | 'completed' | 'cancelled'
    };
  },

  async deleteEvent(id: string): Promise<void> {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
};
