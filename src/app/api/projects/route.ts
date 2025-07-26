import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('platform', 'buildunia')

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Sample projects data
    const sampleProjects = [
      {
        title: 'Smart Robot Car',
        description: 'Build an autonomous robot car with obstacle detection and pathfinding capabilities. Perfect for learning robotics and IoT fundamentals.',
        category: 'Robotics',
        difficulty: 'intermediate',
        price: 2999,
        prices: {
          full: 2999,
          hardware: 1999,
          code: 999,
          mentorship: 1499,
          hardware_mentorship: 3498,
          code_mentorship: 2498
        },
        image_url: '/images/robot-car.svg',
        platform: 'buildunia',
        features: ['Obstacle Detection', 'Pathfinding', 'Remote Control', 'Line Following'],
        requirements: ['Basic Electronics', 'Arduino Programming', 'Soldering Skills'],
        duration: '4-6 weeks'
      },
      {
        title: 'Smart Home Automation',
        description: 'Create a complete smart home system with automated lighting, temperature control, and security monitoring.',
        category: 'Home Automation',
        difficulty: 'beginner',
        price: 1999,
        prices: {
          full: 1999,
          hardware: 1299,
          code: 699,
          mentorship: 999,
          hardware_mentorship: 2298,
          code_mentorship: 1698
        },
        image_url: '/images/smart-home.svg',
        platform: 'buildunia',
        features: ['Smart Lighting', 'Temperature Control', 'Security Monitoring', 'Mobile App Control'],
        requirements: ['Basic Electronics', 'WiFi Connectivity', 'Mobile App Development'],
        duration: '3-4 weeks'
      },
      {
        title: 'Smart Garden System',
        description: 'Build an intelligent garden monitoring system that automatically waters plants and monitors soil conditions.',
        category: 'Agriculture',
        difficulty: 'intermediate',
        price: 2499,
        prices: {
          full: 2499,
          hardware: 1699,
          code: 799,
          mentorship: 1199,
          hardware_mentorship: 2898,
          code_mentorship: 1998
        },
        image_url: '/images/smart-garden.svg',
        platform: 'buildunia',
        features: ['Automatic Watering', 'Soil Monitoring', 'Weather Integration', 'Plant Health Tracking'],
        requirements: ['Basic Electronics', 'Sensor Integration', 'Data Analysis'],
        duration: '4-5 weeks'
      },
      {
        title: 'Weather Station',
        description: 'Create a comprehensive weather monitoring station that tracks temperature, humidity, pressure, and air quality.',
        category: 'Environmental',
        difficulty: 'advanced',
        price: 3499,
        prices: {
          full: 3499,
          hardware: 2399,
          code: 1099,
          mentorship: 1699,
          hardware_mentorship: 4098,
          code_mentorship: 2798
        },
        image_url: '/images/weather-station.svg',
        platform: 'buildunia',
        features: ['Multi-Sensor Monitoring', 'Data Logging', 'Cloud Integration', 'Weather Forecasting'],
        requirements: ['Advanced Electronics', 'Cloud Computing', 'Data Visualization'],
        duration: '5-6 weeks'
      }
    ]

    // Insert sample projects
    const { data, error } = await supabase
      .from('products')
      .insert(sampleProjects)
      .select()

    if (error) {
      console.error('Error inserting products:', error)
      return NextResponse.json({ error: 'Failed to insert products' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Sample projects added successfully', data })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 