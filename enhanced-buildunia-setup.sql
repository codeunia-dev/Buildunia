-- Enhanced BuildUnia Database Schema for Codeunia Integration
-- Supports: IoT + Software projects, Components, Flexible learning, Multiple purchase options

-- =====================================================
-- PART 1: ENHANCED PROJECT SYSTEM
-- =====================================================

-- Enhanced projects table with new project types and purchase options
DROP TABLE IF EXISTS public.buildunia_projects CASCADE;
CREATE TABLE public.buildunia_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    
    -- Project Classification
    project_type TEXT CHECK (project_type IN ('iot', 'software', 'hybrid')) NOT NULL,
    category TEXT NOT NULL, -- Electronics, Web Dev, Mobile, AI/ML, etc.
    subcategory TEXT,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
    
    -- Pricing Structure
    complete_kit_price DECIMAL(10,2), -- Full kit with everything
    components_only_price DECIMAL(10,2), -- Just hardware components
    learning_only_price DECIMAL(10,2), -- Access to tutorials if they have components
    code_only_price DECIMAL(10,2), -- Just source code + docs
    mentorship_price DECIMAL(10,2), -- Per hour mentorship rate
    
    -- Content & Resources
    image_url TEXT,
    image_path TEXT,
    video_preview_url TEXT,
    github_repo_url TEXT,
    documentation_url TEXT,
    
    -- Learning Details
    estimated_time TEXT, -- "2-3 hours", "1 week", etc.
    prerequisites TEXT[], -- Required prior knowledge
    learning_outcomes TEXT[], -- What students will learn
    components TEXT[], -- Required hardware components
    software_requirements TEXT[], -- Required software/tools
    skills TEXT[], -- Skills covered
    
    -- Project Features & Details
    features TEXT[] DEFAULT '{}',
    what_you_will_build TEXT,
    real_world_applications TEXT[],
    
    -- Availability & Stock
    is_active BOOLEAN DEFAULT true,
    components_in_stock INTEGER DEFAULT 0,
    max_enrollment INTEGER, -- For mentorship slots
    
    -- SEO & Marketing
    tags TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT false,
    trending BOOLEAN DEFAULT false,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- PART 2: COMPONENTS CATALOG
-- =====================================================

-- Individual components that can be purchased separately
CREATE TABLE IF NOT EXISTS public.buildunia_components (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- Sensors, Actuators, Controllers, etc.
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    image_url TEXT,
    specifications JSONB, -- Technical specs
    compatibility TEXT[], -- Compatible with which projects
    vendor TEXT,
    sku TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- PART 3: LEARNING PATHS & PROGRESS
-- =====================================================

-- Custom learning paths for different student needs
CREATE TABLE IF NOT EXISTS public.buildunia_learning_paths (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.buildunia_projects(id) ON DELETE CASCADE,
    path_type TEXT CHECK (path_type IN ('beginner', 'intermediate', 'advanced', 'diy')) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    steps JSONB, -- Array of learning steps
    estimated_duration TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Track student progress through learning paths
CREATE TABLE IF NOT EXISTS public.buildunia_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.buildunia_projects(id) ON DELETE CASCADE,
    learning_path_id UUID REFERENCES public.buildunia_learning_paths(id) ON DELETE CASCADE,
    current_step INTEGER DEFAULT 0,
    completed_steps INTEGER[] DEFAULT '{}',
    status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused')) DEFAULT 'not_started',
    completion_percentage INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- PART 4: ENHANCED ORDERS SYSTEM
-- =====================================================

-- Enhanced orders with multiple purchase types
DROP TABLE IF EXISTS public.buildunia_orders CASCADE;
CREATE TABLE public.buildunia_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    order_number TEXT UNIQUE NOT NULL DEFAULT 'BU-' || EXTRACT(EPOCH FROM NOW())::TEXT,
    
    -- Order Details
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    
    -- Status & Processing
    status TEXT CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
    payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
    payment_method TEXT,
    stripe_payment_intent_id TEXT,
    
    -- Shipping Information
    shipping_address JSONB,
    tracking_number TEXT,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enhanced order items with purchase type specification
DROP TABLE IF EXISTS public.buildunia_order_items CASCADE;
CREATE TABLE public.buildunia_order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.buildunia_orders(id) ON DELETE CASCADE,
    
    -- Item References
    project_id UUID REFERENCES public.buildunia_projects(id) ON DELETE CASCADE,
    component_id UUID REFERENCES public.buildunia_components(id) ON DELETE CASCADE,
    
    -- Purchase Details
    purchase_type TEXT CHECK (purchase_type IN ('complete_kit', 'components_only', 'learning_only', 'code_only', 'mentorship', 'individual_component')) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    
    -- Access & Delivery
    digital_access_granted BOOLEAN DEFAULT false,
    physical_shipped BOOLEAN DEFAULT false,
    mentorship_sessions_remaining INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- PART 5: MENTORSHIP SYSTEM
-- =====================================================

-- Mentorship sessions and scheduling
CREATE TABLE IF NOT EXISTS public.buildunia_mentorship_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.buildunia_projects(id) ON DELETE CASCADE,
    
    -- Session Details
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status TEXT CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show')) DEFAULT 'scheduled',
    
    -- Session Content
    topic TEXT,
    agenda TEXT,
    notes TEXT,
    recording_url TEXT,
    
    -- Meeting Details
    meeting_url TEXT,
    meeting_id TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- PART 6: KEEP EXISTING TABLES
-- =====================================================

-- Keep the existing profiles table from previous setup
-- (Already created in database-only-setup.sql)

-- =====================================================
-- PART 7: ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.buildunia_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buildunia_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buildunia_learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buildunia_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buildunia_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buildunia_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buildunia_mentorship_sessions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PART 8: CREATE POLICIES
-- =====================================================

-- Policies for projects (public read, admin write)
CREATE POLICY "BuildUnia projects are viewable by everyone" ON public.buildunia_projects
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage BuildUnia projects" ON public.buildunia_projects
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Policies for components
CREATE POLICY "Components are viewable by everyone" ON public.buildunia_components
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage components" ON public.buildunia_components
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Policies for learning paths
CREATE POLICY "Learning paths are viewable by everyone" ON public.buildunia_learning_paths
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage learning paths" ON public.buildunia_learning_paths
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Policies for progress tracking
CREATE POLICY "Users can view own progress" ON public.buildunia_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.buildunia_progress
    FOR ALL USING (auth.uid() = user_id);

-- Policies for orders
CREATE POLICY "Users can view own BuildUnia orders" ON public.buildunia_orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own BuildUnia orders" ON public.buildunia_orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own BuildUnia orders" ON public.buildunia_orders
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies for order items
CREATE POLICY "Users can view own BuildUnia order items" ON public.buildunia_order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.buildunia_orders 
            WHERE buildunia_orders.id = buildunia_order_items.order_id 
            AND buildunia_orders.user_id = auth.uid()
        )
    );

-- Policies for mentorship sessions
CREATE POLICY "Users can view own mentorship sessions" ON public.buildunia_mentorship_sessions
    FOR SELECT USING (auth.uid() = student_id OR auth.uid() = mentor_id);

CREATE POLICY "Students can create mentorship sessions" ON public.buildunia_mentorship_sessions
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- =====================================================
-- PART 9: TRIGGERS AND FUNCTIONS
-- =====================================================

-- Update triggers for all new tables
CREATE TRIGGER update_buildunia_projects_updated_at BEFORE UPDATE ON public.buildunia_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buildunia_orders_updated_at BEFORE UPDATE ON public.buildunia_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PART 10: SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample IoT project
INSERT INTO public.buildunia_projects (
    name, description, short_description, project_type, category, difficulty,
    complete_kit_price, components_only_price, learning_only_price, code_only_price, mentorship_price,
    estimated_time, prerequisites, learning_outcomes, components, software_requirements, skills,
    what_you_will_build, real_world_applications, tags, featured
) VALUES (
    'Smart Home Security System',
    'Build a complete IoT security system with motion detection, door sensors, and smartphone alerts. Learn ESP32 programming, sensor integration, and mobile app development.',
    'IoT security system with ESP32, sensors, and mobile alerts',
    'iot',
    'Home Automation',
    'intermediate',
    4999.00, 3999.00, 1499.00, 999.00, 799.00,
    '2-3 weeks',
    ARRAY['Basic electronics', 'Arduino basics'],
    ARRAY['ESP32 programming', 'Sensor integration', 'IoT protocols', 'Mobile app basics'],
    ARRAY['ESP32 Dev Board', 'PIR Motion Sensor', 'Door Magnetic Sensor', 'Buzzer', 'LED Strip', 'Breadboard', 'Jumper Wires'],
    ARRAY['Arduino IDE', 'MIT App Inventor', 'Firebase'],
    ARRAY['IoT Development', 'Mobile App Development', 'Cloud Integration'],
    'A fully functional smart security system for your home',
    ARRAY['Home security', 'Office monitoring', 'Pet monitoring'],
    ARRAY['iot', 'security', 'esp32', 'sensors', 'mobile'],
    true
);

-- Insert sample Software project
INSERT INTO public.buildunia_projects (
    name, description, short_description, project_type, category, difficulty,
    complete_kit_price, components_only_price, learning_only_price, code_only_price, mentorship_price,
    estimated_time, prerequisites, learning_outcomes, software_requirements, skills,
    what_you_will_build, real_world_applications, tags, featured
) VALUES (
    'E-commerce Platform with React & Node.js',
    'Build a full-stack e-commerce platform from scratch using React, Node.js, MongoDB, and Stripe integration. Learn modern web development, database design, and payment processing.',
    'Full-stack e-commerce platform with React and Node.js',
    'software',
    'Web Development',
    'advanced',
    NULL, NULL, 2999.00, 1999.00, 899.00,
    '4-6 weeks',
    ARRAY['JavaScript fundamentals', 'Basic React knowledge'],
    ARRAY['Full-stack development', 'Database design', 'API development', 'Payment integration', 'Authentication'],
    ARRAY['Node.js', 'React', 'MongoDB', 'Stripe API', 'VS Code'],
    ARRAY['JavaScript', 'React.js', 'Node.js', 'MongoDB', 'Express.js', 'API Development'],
    'A complete e-commerce platform with admin panel',
    ARRAY['Online stores', 'Marketplace platforms', 'Business websites'],
    ARRAY['react', 'nodejs', 'ecommerce', 'fullstack', 'mongodb'],
    true
);

-- Insert sample components
INSERT INTO public.buildunia_components (name, description, category, price, stock_quantity, specifications) VALUES
('ESP32 Development Board', 'Powerful microcontroller with WiFi and Bluetooth', 'Controllers', 899.00, 50, '{"cpu": "Dual-core", "wifi": "802.11n", "bluetooth": "4.2"}'),
('PIR Motion Sensor', 'Passive infrared sensor for motion detection', 'Sensors', 299.00, 100, '{"detection_range": "7m", "detection_angle": "120°", "voltage": "5V"}'),
('DHT22 Temperature Sensor', 'Digital temperature and humidity sensor', 'Sensors', 399.00, 75, '{"temperature_range": "-40 to 80°C", "humidity_range": "0-100%", "accuracy": "±0.5°C"}');

-- =====================================================
-- VERIFICATION
-- =====================================================

SELECT '✅ Enhanced BuildUnia database setup completed!' as message;
SELECT 'Tables created:' as info, count(*) as table_count FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name LIKE 'buildunia_%';

SELECT '📊 Sample projects added:' as info, count(*) as project_count FROM public.buildunia_projects;
SELECT '🔧 Sample components added:' as info, count(*) as component_count FROM public.buildunia_components;
