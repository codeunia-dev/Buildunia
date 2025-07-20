-- BuildUnia Database Schema
-- Run this script in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.settings.jwt_secret" TO 'your-jwt-secret';

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT, -- This will store the Supabase Storage URL
    image_path TEXT, -- This will store the storage path for management
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
    category TEXT NOT NULL,
    components TEXT[] DEFAULT '{}',
    skills TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    what_you_will_learn TEXT[] DEFAULT '{}',
    estimated_time TEXT,
    support_level TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    total DECIMAL(10,2) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'paid', 'shipped', 'delivered')) DEFAULT 'pending',
    shipping_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user_profiles table (for extended user data and roles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    website TEXT,
    bio TEXT,
    role TEXT CHECK (role IN ('user', 'admin', 'moderator', 'premium')) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for projects (public read access)
CREATE POLICY "Projects are viewable by everyone" ON public.projects
    FOR SELECT USING (true);

-- Create policies for orders (users can only see their own orders)
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON public.orders
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for order_items (users can only see items from their orders)
CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own order items" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Create policies for profiles (users can see all profiles but only edit their own)
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Admin policies for projects (admins can do everything)
CREATE POLICY "Admins can manage projects" ON public.projects
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Insert sample projects data
INSERT INTO public.projects (name, description, price, difficulty, category, components, skills, features, what_you_will_learn, estimated_time, support_level) VALUES
(
    'Smart Home Automation',
    'Build a complete IoT system to control lights, fans, and security systems using WiFi and mobile app. This comprehensive project teaches you the fundamentals of home automation while giving you hands-on experience with real IoT hardware.',
    89.99,
    'intermediate',
    'Arduino',
    ARRAY['Arduino Uno R3', 'ESP8266 WiFi Module', 'Relay Module (4-channel)', 'PIR Motion Sensor', 'Temperature & Humidity Sensor', 'LED Strips', 'Breadboard & Jumper Wires', 'Power Supply', 'Project Enclosure'],
    ARRAY['Arduino Programming', 'WiFi Connectivity', 'Sensor Integration', 'Mobile App Development'],
    ARRAY['Control lights and appliances remotely', 'Motion detection and alerts', 'Temperature and humidity monitoring', 'Mobile app for iOS and Android', 'Voice control integration', 'Energy usage tracking'],
    ARRAY['IoT system architecture and design', 'Arduino programming and libraries', 'WiFi communication protocols', 'Sensor data collection and processing', 'Mobile app development basics', 'Home automation best practices'],
    '2-3 weeks',
    'Full documentation + video tutorials + community support'
),
(
    'Weather Station',
    'Create a professional weather monitoring system with cloud data logging and real-time dashboard. Perfect for learning IoT fundamentals with immediate practical applications.',
    69.99,
    'beginner',
    'ESP32',
    ARRAY['ESP32 Development Board', 'BME280 Sensor', 'Rain Sensor', 'Wind Speed Sensor', 'Solar Panel', 'Battery Pack', 'Weatherproof Enclosure'],
    ARRAY['ESP32 Programming', 'Sensor Integration', 'Cloud Connectivity', 'Data Visualization'],
    ARRAY['Real-time weather data', 'Cloud data storage', 'Web dashboard', 'Mobile notifications', 'Historical data analysis'],
    ARRAY['ESP32 programming', 'Sensor integration', 'Cloud connectivity', 'Data visualization', 'Weather prediction basics'],
    '1-2 weeks',
    'Full documentation + video tutorials'
),
(
    'Smart Agriculture Monitor',
    'Monitor soil moisture, temperature, humidity and automate irrigation systems with ML predictions. Advanced project combining IoT with machine learning.',
    99.99,
    'advanced',
    'Raspberry Pi',
    ARRAY['Raspberry Pi 4', 'Soil Moisture Sensors', 'Temperature/Humidity Sensors', 'Water Pump', 'Relay Module', 'Camera Module', 'Solar Panel Kit', 'Waterproof Enclosure'],
    ARRAY['Raspberry Pi', 'Python', 'Machine Learning', 'Automation'],
    ARRAY['Automated irrigation system', 'ML-based predictions', 'Remote monitoring', 'Camera surveillance', 'Mobile alerts', 'Data analytics dashboard'],
    ARRAY['Raspberry Pi programming', 'Python for IoT', 'Machine learning basics', 'Agricultural automation', 'Computer vision'],
    '3-4 weeks',
    'Full documentation + video tutorials + 1-on-1 support'
),
(
    'Security Camera System',
    'Build an intelligent security system with motion detection, alerts, and live streaming capabilities using computer vision.',
    129.99,
    'advanced',
    'Raspberry Pi',
    ARRAY['Raspberry Pi 4', 'Camera Module v3', 'PIR Motion Sensor', 'Servo Motor', 'LED Indicators', 'Speaker Module', 'Power Supply', 'Mounting Hardware'],
    ARRAY['Raspberry Pi', 'Computer Vision', 'AI Detection', 'Streaming'],
    ARRAY['Motion detection and alerts', 'Live video streaming', 'Face recognition', 'Mobile notifications', 'Cloud storage', 'Night vision capability'],
    ARRAY['Computer vision programming', 'Real-time video processing', 'AI/ML integration', 'Security system design', 'Network streaming protocols'],
    '2-3 weeks',
    'Full documentation + video tutorials + expert support'
),
(
    'LED Matrix Display',
    'Create colorful LED displays with animations, text scrolling, and smartphone app control. Great introduction to IoT and visual programming.',
    49.99,
    'beginner',
    'Arduino',
    ARRAY['Arduino Nano', 'LED Matrix 8x8', 'Bluetooth Module', 'Power Supply', 'Resistors', 'Jumper Wires', 'Breadboard', 'Project Case'],
    ARRAY['Arduino', 'LED Programming', 'Bluetooth', 'Mobile Apps'],
    ARRAY['Colorful LED animations', 'Text scrolling display', 'Bluetooth connectivity', 'Mobile app control', 'Custom patterns', 'Real-time clock display'],
    ARRAY['LED matrix programming', 'Animation techniques', 'Bluetooth communication', 'Mobile app basics', 'Digital art creation'],
    '1 week',
    'Full documentation + video tutorials'
),
(
    'Environmental Monitor',
    'Track air quality, noise levels, and environmental conditions with comprehensive data visualization and alerting system.',
    79.99,
    'intermediate',
    'ESP32',
    ARRAY['ESP32 DevKit', 'Air Quality Sensor', 'Sound Level Sensor', 'Temperature/Humidity Sensor', 'OLED Display', 'MicroSD Card', 'Battery Pack', 'Enclosure'],
    ARRAY['ESP32', 'Environmental Sensing', 'Data Logging', 'Web APIs'],
    ARRAY['Air quality monitoring', 'Noise level detection', 'Environmental data logging', 'Web dashboard', 'Email alerts', 'Historical data analysis'],
    ARRAY['Environmental sensor programming', 'Data logging techniques', 'Web API integration', 'Dashboard development', 'Alert system design'],
    '2-3 weeks',
    'Full documentation + video tutorials + community support'
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (if needed)
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, authenticated, service_role;

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies for project images
CREATE POLICY "Project images are publicly viewable" ON storage.objects
FOR SELECT USING (bucket_id = 'project-images');

CREATE POLICY "Admins can upload project images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'project-images' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update project images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'project-images' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete project images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'project-images' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_difficulty ON public.projects(difficulty);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_project_id ON public.order_items(project_id);
