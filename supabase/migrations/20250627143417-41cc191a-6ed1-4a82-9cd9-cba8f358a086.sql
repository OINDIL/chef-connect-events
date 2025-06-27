
-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create chefs table
CREATE TABLE public.chefs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  specialty TEXT NOT NULL,
  experience INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  location TEXT,
  bio TEXT,
  price_range TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  guests INTEGER NOT NULL,
  chef_id UUID REFERENCES public.chefs(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert some sample chefs
INSERT INTO public.chefs (name, email, phone, specialty, experience, rating, location, bio, price_range, status, image_url) VALUES
('Chef Mario Rossi', 'mario@example.com', '+1 (555) 123-4567', 'Italian Cuisine', 15, 4.9, 'New York, NY', 'Passionate Italian chef with 15 years of experience in fine dining.', '$150-250/hour', 'active', 'photo-1649972904349-6e44c42644a7'),
('Chef Sarah Johnson', 'sarah@example.com', '+1 (555) 234-5678', 'French Cuisine', 12, 4.8, 'Los Angeles, CA', 'French cuisine specialist with expertise in molecular gastronomy.', '$120-200/hour', 'active', 'photo-1488590528505-98d2b5aba04b'),
('Chef David Chen', 'david@example.com', '+1 (555) 345-6789', 'Asian Fusion', 10, 4.7, 'San Francisco, CA', 'Creative Asian fusion chef blending traditional and modern techniques.', '$100-180/hour', 'active', 'photo-1581091226825-a6a2a5aee158');

-- Insert some sample events
INSERT INTO public.events (title, type, date, time, location, guests, chef_id, client_name, client_email, client_phone, status, price, description) VALUES
('Elegant Wedding Reception', 'Wedding', '2024-07-15', '18:00', 'Grand Ballroom, NYC', 150, (SELECT id FROM public.chefs WHERE name = 'Chef Mario Rossi'), 'Emily & James', 'emily.james@example.com', '+1 (555) 123-4567', 'confirmed', 3500.00, 'Elegant Italian wedding reception with multi-course dinner'),
('Corporate Annual Dinner', 'Corporate', '2024-07-20', '19:00', 'Tech Center, SF', 80, (SELECT id FROM public.chefs WHERE name = 'Chef Sarah Johnson'), 'TechCorp Inc.', 'events@techcorp.com', '+1 (555) 234-5678', 'pending', 2400.00, 'Annual corporate dinner with French cuisine theme'),
('Birthday Celebration', 'Birthday', '2024-07-18', '17:00', 'Private Home, LA', 25, (SELECT id FROM public.chefs WHERE name = 'Chef David Chen'), 'Michael Rodriguez', 'michael@example.com', '+1 (555) 345-6789', 'confirmed', 1200.00, '50th birthday celebration with Asian fusion menu');

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles (users can only see/edit their own profile)
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for chefs (public read, admin write)
CREATE POLICY "Anyone can view chefs" ON public.chefs FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage chefs" ON public.chefs FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for events (public read, authenticated write)
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage events" ON public.events FOR ALL USING (auth.role() = 'authenticated');

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.email
  );
  RETURN new;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
