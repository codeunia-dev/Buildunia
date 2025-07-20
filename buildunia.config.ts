// BuildUnia Module Configuration
// This file configures the BuildUnia module for integration with Codeunia

export const builduniaConfig = {
  // Module Information
  name: 'BuildUnia',
  version: '1.0.0',
  description: 'IoT & Software Projects Marketplace with Mentorship',
  
  // Integration Settings
  integration: {
    // Base route for all BuildUnia pages
    baseRoute: '/buildunia',
    
    // API namespace
    apiNamespace: '/api/buildunia',
    
    // Database table prefix
    tablePrefix: 'buildunia_',
    
    // Shared authentication
    useSharedAuth: true,
    
    // Shared user profiles
    extendProfiles: true
  },

  // Business Model Configuration
  businessModel: {
    // Supported project types
    projectTypes: [
      'iot',        // IoT/Hardware projects
      'software',   // Software projects
      'hybrid'      // Mix of both
    ],
    
    // Purchase options
    purchaseOptions: [
      'complete_kit',     // Full kit with everything
      'components_only',  // Just hardware components
      'learning_only',    // Access to tutorials (if they have components)
      'code_only',       // Just source code + documentation
      'mentorship',      // 1-on-1 guidance sessions
      'individual_component' // Single components
    ],
    
    // Learning paths
    learningPaths: [
      'beginner',     // Complete guidance from scratch
      'intermediate', // Skip basics, focus on implementation
      'advanced',     // Concepts + challenges only
      'diy'          // Just resources, minimal guidance
    ],
    
    // Supported categories
    categories: {
      iot: [
        'Home Automation',
        'Robotics',
        'IoT Sensors',
        'Arduino Projects',
        'ESP32 Projects',
        'Raspberry Pi'
      ],
      software: [
        'Web Development',
        'Mobile Apps',
        'Desktop Applications',
        'AI/ML Projects',
        'Game Development',
        'APIs & Backend'
      ]
    }
  },

  // Feature Flags
  features: {
    // Core features
    projectCatalog: true,
    componentStore: true,
    learningPaths: true,
    progressTracking: true,
    mentorshipBooking: true,
    
    // Advanced features
    adminPanel: true,
    analyticsReporting: true,
    inventoryManagement: true,
    bulkOrders: true,
    subscriptions: true,
    
    // Integration features
    crossPlatformCart: true,
    unifiedSearch: true,
    sharedNotifications: true,
    socialFeatures: true
  },

  // UI Configuration
  ui: {
    // Theme integration - Force Dark Mode
    useCodeuniaTheme: true,
    forceDarkMode: true, // Force dark theme always
    
    // Dark theme brand colors
    brandColors: {
      primary: '#3B82F6',    // Blue
      secondary: '#10B981',  // Green  
      accent: '#F59E0B',     // Orange
      neutral: '#6B7280',    // Gray
      background: '#000000', // Pure black
      foreground: '#FFFFFF'  // Pure white
    },
    
    // Navigation
    showInMainNav: true,
    navLabel: 'Projects & Kits',
    navIcon: 'package',
    
    // Layout
    useCodeuniaLayout: true,
    showBreadcrumbs: true,
    showSearchBar: true
  },

  // Database Configuration
  database: {
    // Main tables
    tables: [
      'buildunia_projects',
      'buildunia_components', 
      'buildunia_orders',
      'buildunia_order_items',
      'buildunia_learning_paths',
      'buildunia_progress',
      'buildunia_mentorship_sessions'
    ],
    
    // Storage buckets
    storageBuckets: [
      'project-images',
      'component-images',
      'project-files',
      'learning-materials'
    ],
    
    // Required policies
    requiredPolicies: [
      'public_read_access',
      'admin_full_access', 
      'user_own_data_access'
    ]
  },

  // Payment Configuration
  payments: {
    // Supported methods
    methods: ['stripe', 'razorpay'],
    
    // Currency
    defaultCurrency: 'INR',
    
    // Tax configuration
    includeTax: true,
    taxRate: 18, // GST in India
    
    // Shipping
    shippingEnabled: true,
    freeShippingThreshold: 2000, // ₹2000
    
    // Subscription support
    subscriptionsEnabled: true
  },

  // Mentorship Configuration
  mentorship: {
    // Session durations (in minutes)
    sessionDurations: [30, 60, 90, 120],
    
    // Default session duration
    defaultDuration: 60,
    
    // Booking window (days in advance)
    maxBookingDays: 30,
    minBookingHours: 24,
    
    // Meeting platforms
    platforms: ['zoom', 'google-meet', 'teams'],
    defaultPlatform: 'zoom',
    
    // Pricing
    basePricePerHour: 799, // ₹799/hour
    
    // Mentor requirements
    requireMentorApproval: true,
    mentorQualifications: [
      'Industry experience',
      'Teaching background', 
      'Project expertise'
    ]
  },

  // Analytics & Reporting
  analytics: {
    // Track user behavior
    trackUserJourney: true,
    trackProjectViews: true,
    trackPurchases: true,
    trackLearningProgress: true,
    
    // Business metrics
    trackRevenue: true,
    trackInventory: true,
    trackMentorshipUsage: true,
    
    // Integration with main Codeunia analytics
    integrateWithMainAnalytics: true
  },

  // SEO Configuration
  seo: {
    // Meta information
    siteName: 'BuildUnia - Projects & Kits by Codeunia',
    defaultTitle: 'IoT & Software Projects | BuildUnia',
    defaultDescription: 'Learn by building real projects. Get complete kits, components, and mentorship for IoT and software development.',
    
    // Open Graph
    ogImage: '/buildunia/og-image.jpg',
    twitterCard: 'summary_large_image',
    
    // Structured data
    enableStructuredData: true,
    organizationName: 'Codeunia',
    organizationUrl: 'https://codeunia.com'
  }
};

// Helper functions for integration
export const builduniaHelpers = {
  // Check if BuildUnia is enabled
  isEnabled: () => process.env.NEXT_PUBLIC_BUILDUNIA_ENABLED === 'true',
  
  // Get base URL for BuildUnia routes
  getBaseUrl: () => builduniaConfig.integration.baseRoute,
  
  // Get API URL for specific endpoint
  getApiUrl: (endpoint: string) => `${builduniaConfig.integration.apiNamespace}/${endpoint}`,
  
  // Check if user has access to admin features
  hasAdminAccess: (userRole: string) => ['admin', 'super_admin'].includes(userRole),
  
  // Format price with currency
  formatPrice: (price: number) => `₹${price.toLocaleString('en-IN')}`,
  
  // Get project route
  getProjectRoute: (projectId: string) => `${builduniaConfig.integration.baseRoute}/projects/${projectId}`,
  
  // Get category route
  getCategoryRoute: (category: string) => `${builduniaConfig.integration.baseRoute}/projects?category=${category}`
};

export default builduniaConfig;
