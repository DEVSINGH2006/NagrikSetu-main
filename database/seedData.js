// Seed data for NagrikSetu MongoDB Collections
export const seedUsers = [
  {
    _id: 'admin_demo_01',
    name: 'NagrikSetu Administrator',
    email: 'admin@nagriksetu.in',
    password: 'adminpassword123',
    role: 'admin',
    phone: '+91 98765 43210',
    address: 'Municipal Corporation HQ, Khanderao Market, Vadodara',
    profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80'
  },
  {
    _id: 'citizen_demo_01',
    name: 'Aarav Sharma',
    email: 'citizen@nagriksetu.in',
    password: 'citizenpassword123',
    role: 'citizen',
    phone: '+91 98765 12345',
    address: 'Alkapuri, Vadodara',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  },
  {
    _id: 'citizen_demo_02',
    name: 'Pooja Patel',
    email: 'pooja.patel@nagriksetu.in',
    password: 'citizenpassword123',
    role: 'citizen',
    phone: '+91 98250 88991',
    address: 'Akota, Vadodara',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
  },
  {
    _id: 'citizen_demo_03',
    name: 'Karan Dave',
    email: 'karan.dave@nagriksetu.in',
    password: 'citizenpassword123',
    role: 'citizen',
    phone: '+91 94260 11223',
    address: 'Fatehgunj, Vadodara',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
  }
];

export const seedIssues = [
  {
    _id: 'issue-001',
    title: 'Deep Hazardous Pothole near Sayaji Baug Main Gate',
    category: 'Pothole',
    description: 'A deep crater-like pothole has opened up after recent rain right near the main entry gate of Sayaji Baug. Two two-wheeler riders almost lost balance during evening rush hour.',
    status: 'submitted',
    address: 'Sayaji Path, Near Kala Ghoda Circle, Vadodara',
    location: {
      address: 'Sayaji Path, Near Kala Ghoda Circle, Vadodara',
      coordinates: { lat: 22.3115, lng: 73.1892 }
    },
    latitude: 22.3115,
    longitude: 73.1892,
    photos: ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'],
    reportedBy: {
      _id: 'citizen_demo_01',
      name: 'Aarav Sharma',
      email: 'citizen@nagriksetu.in',
      profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    },
    reportedById: 'citizen_demo_01',
    aiPriority: 'high',
    aiCategory: 'Roads & Potholes',
    aiSuggestion: 'Immediate asphalt patching recommended. High risk for two-wheelers.',
    upvotes: ['citizen_demo_01', 'citizen_demo_02', 'citizen_demo_03']
  },
  {
    _id: 'issue-002',
    title: 'Overflowing Municipal Garbage Container on Station Road',
    category: 'Garbage',
    description: 'Municipal garbage dump bin has not been cleared for 3 days. Waste is spilling onto the pedestrian sidewalk and attracting stray animals.',
    status: 'progress',
    address: 'Alkapuri Station Road, Opposite Welcome Hotel, Vadodara',
    location: {
      address: 'Alkapuri Station Road, Opposite Welcome Hotel, Vadodara',
      coordinates: { lat: 22.3089, lng: 73.1765 }
    },
    latitude: 22.3089,
    longitude: 73.1765,
    photos: ['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80'],
    reportedBy: {
      _id: 'citizen_demo_02',
      name: 'Pooja Patel',
      email: 'pooja.patel@nagriksetu.in',
      profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
    },
    reportedById: 'citizen_demo_02',
    aiPriority: 'medium',
    aiCategory: 'Waste Management',
    aiSuggestion: 'Deploy municipal waste collection truck and sanitize the surrounding sidewalk.',
    upvotes: ['citizen_demo_01', 'citizen_demo_02']
  },
  {
    _id: 'issue-003',
    title: 'Broken High-Mast Streetlights on Akota Bridge',
    category: 'Streetlight',
    description: 'A stretch of 4 consecutive streetlights on Akota Bridge have been completely dark for over 48 hours, causing severe visibility hazard at night.',
    status: 'resolved',
    address: 'Akota Bridge Circle, Akota, Vadodara',
    location: {
      address: 'Akota Bridge Circle, Akota, Vadodara',
      coordinates: { lat: 22.2985, lng: 73.1724 }
    },
    latitude: 22.2985,
    longitude: 73.1724,
    photos: ['https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80'],
    reportedBy: {
      _id: 'citizen_demo_03',
      name: 'Karan Dave',
      email: 'karan.dave@nagriksetu.in',
      profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    },
    reportedById: 'citizen_demo_03',
    aiPriority: 'high',
    aiCategory: 'Electrical & Lighting',
    aiSuggestion: 'Replace blown LED bulbs and check feeder line voltage on Akota pole unit #4.',
    upvotes: ['citizen_demo_01', 'citizen_demo_03']
  },
  {
    _id: 'issue-004',
    title: 'Underground Drinking Water Pipeline Leakage',
    category: 'Water',
    description: 'Major potable drinking water pipe burst underneath the pavement. Clean water has been gushing onto the road since early morning.',
    status: 'progress',
    address: 'Near Fatehgunj Post Office, Fatehgunj, Vadodara',
    location: {
      address: 'Near Fatehgunj Post Office, Fatehgunj, Vadodara',
      coordinates: { lat: 22.3218, lng: 73.1874 }
    },
    latitude: 22.3218,
    longitude: 73.1874,
    photos: ['https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80'],
    reportedBy: {
      _id: 'citizen_demo_01',
      name: 'Aarav Sharma',
      email: 'citizen@nagriksetu.in',
      profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    },
    reportedById: 'citizen_demo_01',
    aiPriority: 'high',
    aiCategory: 'Water Works',
    aiSuggestion: 'Emergency main valve shutdown advised. Hydraulic team dispatch for pipeline clamp/weld.',
    upvotes: ['citizen_demo_02', 'citizen_demo_03']
  },
  {
    _id: 'issue-005',
    title: 'Severe Traffic Congestion Due to Faulty Signal',
    category: 'Traffic',
    description: 'Traffic signal timer stuck on red for Northbound traffic leading to bumper-to-bumper jam across the junction.',
    status: 'submitted',
    address: 'Genda Circle, Vadodara Central, Vadodara',
    location: {
      address: 'Genda Circle, Vadodara Central, Vadodara',
      coordinates: { lat: 22.3160, lng: 73.1710 }
    },
    latitude: 22.3160,
    longitude: 73.1710,
    photos: ['https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80'],
    reportedBy: {
      _id: 'citizen_demo_02',
      name: 'Pooja Patel',
      email: 'pooja.patel@nagriksetu.in',
      profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
    },
    reportedById: 'citizen_demo_02',
    aiPriority: 'medium',
    aiCategory: 'Traffic Police & Signals',
    aiSuggestion: 'Traffic police control room notified to reset controller unit.',
    upvotes: ['citizen_demo_01']
  },
  {
    _id: 'issue-006',
    title: 'Open Manhole Cover Near Primary School',
    category: 'Drainage Overflow',
    description: 'Open stormwater drainage manhole cover left open without safety barricades or warnings, directly on school walking path.',
    status: 'submitted',
    address: 'Gotri Road, Near Yash Complex, Vadodara',
    location: {
      address: 'Gotri Road, Near Yash Complex, Vadodara',
      coordinates: { lat: 22.3225, lng: 73.1480 }
    },
    latitude: 22.3225,
    longitude: 73.1480,
    photos: ['https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80'],
    reportedBy: {
      _id: 'citizen_demo_03',
      name: 'Karan Dave',
      email: 'karan.dave@nagriksetu.in',
      profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    },
    reportedById: 'citizen_demo_03',
    aiPriority: 'high',
    aiCategory: 'Municipal Drainage',
    aiSuggestion: 'Urgent hazard warning: Place barrier immediately and seal ductile iron lid.',
    upvotes: ['citizen_demo_01', 'citizen_demo_02', 'citizen_demo_03']
  }
];
