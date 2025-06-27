
-- Add authentication-related columns to events table to link events to authenticated users
ALTER TABLE public.events ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create user_bookings table to track user's booking history and preferences
CREATE TABLE public.user_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  booking_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, event_id)
);

-- Enable RLS on user_bookings
ALTER TABLE public.user_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for user_bookings
CREATE POLICY "Users can view their own bookings" ON public.user_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bookings" ON public.user_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookings" ON public.user_bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bookings" ON public.user_bookings FOR DELETE USING (auth.uid() = user_id);

-- Update events policies to allow users to see their own events and admins to see all
DROP POLICY IF EXISTS "Anyone can view events" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can manage events" ON public.events;

-- New events policies
CREATE POLICY "Users can view their own events" ON public.events FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Authenticated users can create events" ON public.events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own events" ON public.events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Event owners can delete their events" ON public.events FOR DELETE USING (auth.uid() = user_id);

-- Create admin role system
CREATE TYPE public.user_role AS ENUM ('admin', 'user');

-- Add role to profiles table
ALTER TABLE public.profiles ADD COLUMN role user_role NOT NULL DEFAULT 'user';

-- Update handle_new_user function to set default role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.email,
    'user'
  );
  RETURN new;
END;
$$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Admin policies for chefs (only admins can modify)
DROP POLICY IF EXISTS "Authenticated users can manage chefs" ON public.chefs;
CREATE POLICY "Admins can manage all chefs" ON public.chefs FOR ALL USING (public.is_admin());

-- Admin policies for all events (admins can see and manage all events)
CREATE POLICY "Admins can manage all events" ON public.events FOR ALL USING (public.is_admin());

-- Create an admin user (you'll need to sign up first, then we can promote to admin)
-- This will be handled in the application code
