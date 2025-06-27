
import { supabase } from "@/integrations/supabase/client";

export interface UserBooking {
  id: string;
  user_id: string;
  event_id: string;
  booking_date: string;
  notes: string | null;
  rating: number | null;
  review: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateUserBookingData {
  event_id: string;
  notes?: string;
}

export const userService = {
  async createBooking(bookingData: CreateUserBookingData): Promise<UserBooking> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_bookings')
      .insert([{
        ...bookingData,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      throw error;
    }

    return data;
  },

  async getUserBookings(): Promise<UserBooking[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }

    return data || [];
  },

  async updateBookingReview(bookingId: string, rating: number, review: string): Promise<UserBooking> {
    const { data, error } = await supabase
      .from('user_bookings')
      .update({ 
        rating, 
        review, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      console.error('Error updating booking review:', error);
      throw error;
    }

    return data;
  }
};
