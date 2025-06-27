
import { supabase } from "@/integrations/supabase/client";

export interface Chef {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  specialty: string;
  experience: number;
  rating: number;
  location: string | null;
  bio: string | null;
  price_range: string | null;
  status: 'active' | 'inactive';
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateChefData {
  name: string;
  email: string;
  phone?: string;
  specialty: string;
  experience: number;
  location?: string;
  bio?: string;
  price_range?: string;
  status: 'active' | 'inactive';
}

export const chefService = {
  async getAllChefs(): Promise<Chef[]> {
    const { data, error } = await supabase
      .from('chefs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching chefs:', error);
      throw error;
    }

    return (data || []).map(chef => ({
      ...chef,
      status: chef.status as 'active' | 'inactive'
    }));
  },

  async createChef(chefData: CreateChefData): Promise<Chef> {
    const { data, error } = await supabase
      .from('chefs')
      .insert([chefData])
      .select()
      .single();

    if (error) {
      console.error('Error creating chef:', error);
      throw error;
    }

    return {
      ...data,
      status: data.status as 'active' | 'inactive'
    };
  },

  async updateChef(id: string, chefData: Partial<CreateChefData>): Promise<Chef> {
    const { data, error } = await supabase
      .from('chefs')
      .update({ ...chefData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating chef:', error);
      throw error;
    }

    return {
      ...data,
      status: data.status as 'active' | 'inactive'
    };
  },

  async deleteChef(id: string): Promise<void> {
    const { error } = await supabase
      .from('chefs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting chef:', error);
      throw error;
    }
  }
};
