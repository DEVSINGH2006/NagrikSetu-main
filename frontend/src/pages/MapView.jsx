/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Filter, Layers, Navigation, Info, Search, AlertCircle, Clock, CheckCircle2, ChevronRight, ThumbsUp } from 'lucide-react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Helper component to programmatically pan/zoom map
const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 14, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
};

// Helper to extract [lat, lng] from various issue formats
const extractCoordinates = (issue) => {
  if (!issue) return null;
  
  if (typeof issue.latitude === 'number' && typeof issue.longitude === 'number') {
    return [issue.latitude, issue.longitude];
  }
  if (typeof issue.lat === 'number' && typeof issue.lng === 'number') {
    return [issue.lat, issue.lng];
  }

  if (issue.location) {
    if (typeof issue.location.latitude === 'number' && typeof issue.location.longitude === 'number') {
      return [issue.location.latitude, issue.location.longitude];
    }
    if (typeof issue.location.lat === 'number' && typeof issue.location.lng === 'number') {
      return [issue.location.lat, issue.location.lng];
    }
    const coords = issue.location.coordinates;
    if (coords) {
      if (typeof coords.lat === 'number' && typeof coords.lng === 'number') {
        return [coords.lat, coords.lng];
      }
      if (typeof coords.latitude === 'number' && typeof coords.longitude === 'number') {
        return [coords.latitude, coords.longitude];
      }
      if (Array.isArray(coords) && coords.length >= 2) {
        return [Number(coords[1]), Number(coords[0])]; // GeoJSON [lng, lat]
      }
    }
  }

  return null;
};

// Custom Marker Generator with status color
const createCustomIcon = (status) => {
  let color = '#EF4444'; // default pending: red
  let ring = '#FECACA';
  if (status === 'progress' || status === 'review' || status === 'in-progress') {
    color = '#F59E0B'; // amber
    ring = '#FDE68A';
  } else if (status === 'resolved') {
    color = '#10B981'; // emerald
    ring = '#A7F3D0';
  }

  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; inset: -4px; border-radius: 50%; background-color: ${ring}; opacity: 0.35; animation: pulse 2s infinite;"></div>
        <div style="position: relative; width: 30px; height: 30px; border-radius: 50%; background-color: ${color}; border: 2.5px solid #FFFFFF; box-shadow: 0 4px 14px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32]
  });
};

const userLocationIcon = L.divIcon({
  className: 'custom-map-marker',
  html: `
    <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; inset: -6px; border-radius: 50%; background-color: #6366F1; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="position: relative; width: 22px; height: 22px; border-radius: 50%; background-color: #6366F1; border: 3px solid #FFFFFF; box-shadow: 0 0 15px rgba(99,102,241,0.8);"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Seed issues to ensure visual vibrancy if backend has no coordinate-enabled items
const DEFAULT_SAMPLE_ISSUES = [
  {
    _id: 'sample-1',
    title: 'Severe Pothole on Sayaji Path',
    category: 'Pothole',
    status: 'submitted',
    description: 'Deep road depression causing vehicle slow down and risk of motorcycle skidding.',
    location: { address: 'Sayaji Path, Near RC Dutt Road, Vadodara', coordinates: { lat: 22.3120, lng: 73.1860 } },
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    upvotes: [1, 2, 3]
  },
  {
    _id: 'sample-2',
    title: 'Overflowing Municipal Garbage Dump',
    category: 'Garbage',
    status: 'progress',
    description: 'Waste container overflowed 2 days ago and spilling onto the pedestrian sidewalk.',
    location: { address: 'Alkapuri Station Road, Vadodara', coordinates: { lat: 22.3085, lng: 73.1740 } },
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    upvotes: [1, 2, 3, 4, 5]
  },
  {
    _id: 'sample-3',
    title: 'Faulty High-Mast Streetlight',
    category: 'Streetlight',
    status: 'resolved',
    description: 'Streetlight intersection was dark for a week. Repaired by ward electrical team.',
    location: { address: 'Akota Bridge Circle, Vadodara', coordinates: { lat: 22.2960, lng: 73.1810 } },
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    upvotes: [1, 2, 3, 4, 5, 6, 7]
  },
  {
    _id: 'sample-4',
    title: 'Main Pipeline Drinking Water Leak',
    category: 'Water',
    status: 'submitted',
    description: 'Fresh drinking water gushing onto the road from underground joint failure.',
    location: { address: 'Fatehgunj Main Market, Vadodara', coordinates: { lat: 22.3210, lng: 73.1905 } },
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    upvotes: [1, 2]
  }
];

const MapView = () => {
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [mapCenter, setMapCenter] = useState([22.3072, 73.1812]); // Vadodara default
  const [zoom, setZoom] = useState(13);
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      let localIssues = [];
      try {
        localIssues = JSON.parse(localStorage.getItem('myIssues') || '[]');
      } catch {
        localIssues = [];
      }

      try {
        const res = await axios.get('/api/issues');
        if (Array.isArray(res.data) && res.data.length > 0) {
          const apiIds = new Set(res.data.map(i => i._id));
          const uniqueLocal = localIssues.filter(l => !apiIds.has(l._id));
          const combined = [...uniqueLocal, ...res.data];
          const hasCoords = combined.some(i => extractCoordinates(i));
          setIssues(hasCoords ? combined : [...combined, ...DEFAULT_SAMPLE_ISSUES]);
        } else {
          setIssues([...localIssues, ...DEFAULT_SAMPLE_ISSUES]);
        }
      } catch (err) {
        console.warn('Backend issues API offline, rendering local and sample markers:', err.message);
        setIssues([...localIssues, ...DEFAULT_SAMPLE_ISSUES]);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const handleFocusCity = () => {
    setMapCenter([22.3072, 73.1812]);
    setZoom(14);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation([latitude, longitude]);
        setMapCenter([latitude, longitude]);
        setZoom(15);
        setLocating(false);
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        alert('Could not access your location. Please check your browser permissions.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const coords = extractCoordinates(issue);
      if (!coords) return false;

      const category = (issue.category || '').toLowerCase();
      const matchFilter = filter === 'all' || category === filter.toLowerCase();

      const title = (issue.title || '').toLowerCase();
      const desc = (issue.description || '').toLowerCase();
      const address = (issue.location?.address || '').toLowerCase();
      const q = search.toLowerCase();
      const matchSearch = !q || title.includes(q) || desc.includes(q) || address.includes(q);

      return matchFilter && matchSearch;
    });
  }, [issues, filter, search]);

  const stats = useMemo(() => {
    const total = filteredIssues.length;
    const pending = filteredIssues.filter(i => (i.status === 'submitted' || !i.status)).length;
    const progress = filteredIssues.filter(i => i.status === 'progress' || i.status === 'review').length;
    const resolved = filteredIssues.filter(i => i.status === 'resolved').length;
    return { total, pending, progress, resolved };
  }, [filteredIssues]);

  return (
    <div className="relative h-[calc(100vh-80px)] w-full bg-[#0F172A] overflow-hidden">
      {/* Floating Left Control Panel */}
      <div className="absolute top-6 left-6 z-[1000] w-84 max-w-[calc(100vw-3rem)] space-y-4 pointer-events-auto">
        <div className="glass p-5 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xl shadow-inner">
                🇮🇳
              </div>
              <div>
                <h3 className="font-bold text-white text-base leading-tight font-serif">NagrikSetu Map</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-none mt-1">Live Civic Pulse</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {stats.total} Active
            </span>
          </div>

          {/* Search Box */}
          <div className="relative mb-4">
            <input 
              type="text" 
              placeholder="Search area, landmark or issue..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
            />
            <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Issue Categories */}
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Category Filter</p>
            {['all', 'pothole', 'garbage', 'streetlight', 'water', 'traffic'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs capitalize transition-all flex items-center justify-between ${
                  filter === type 
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30' 
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <span>{type === 'all' ? 'All Issues' : type}</span>
                {filter === type && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>}
              </button>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <span className="block font-bold text-red-400 text-sm">{stats.pending}</span>
              <span className="text-slate-400">Pending</span>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <span className="block font-bold text-amber-400 text-sm">{stats.progress}</span>
              <span className="text-slate-400">In Progress</span>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="block font-bold text-emerald-400 text-sm">{stats.resolved}</span>
              <span className="text-slate-400">Resolved</span>
            </div>
          </div>
        </div>

        {/* Status Legend */}
        <div className="glass px-4 py-3 rounded-2xl border border-white/10 shadow-lg flex items-center justify-between text-[11px] font-medium text-slate-300">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
            <span>Resolved</span>
          </div>
        </div>
      </div>

      {/* Main Leaflet Map with OpenStreetMap Tiles */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={mapCenter} 
          zoom={zoom} 
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapController center={mapCenter} zoom={zoom} />

          {/* User Location Marker */}
          {userLocation && (
            <Marker position={userLocation} icon={userLocationIcon}>
              <Popup>
                <div className="p-3 text-center">
                  <p className="font-bold text-indigo-400 text-xs">Your Current Location</p>
                  <p className="text-[11px] text-slate-300 mt-1">
                    {userLocation[0].toFixed(5)}, {userLocation[1].toFixed(5)}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Issue Markers */}
          {filteredIssues.map((issue) => {
            const coords = extractCoordinates(issue);
            if (!coords) return null;

            const status = (issue.status || 'submitted').toLowerCase();
            const icon = createCustomIcon(status);

            return (
              <Marker 
                key={issue._id || `${coords[0]}-${coords[1]}`} 
                position={coords} 
                icon={icon}
                eventHandlers={{
                  click: () => setSelectedIssue(issue)
                }}
              >
                <Popup>
                  <div className="w-64 max-w-xs p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {issue.category || 'Civic Issue'}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        status === 'resolved' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' :
                        status === 'progress' || status === 'review' ? 'bg-amber-950/80 text-amber-300 border-amber-500/40' :
                        'bg-amber-950/80 text-amber-300 border-amber-500/40'
                      }`}>
                        {status === 'resolved' ? 'Completed' : (status === 'progress' ? 'In Progress' : 'Pending')}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-sm text-white leading-snug line-clamp-2">
                      {issue.title}
                    </h4>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {issue.description}
                    </p>

                    {issue.location?.address && (
                      <div className="flex items-start gap-1 text-[11px] text-slate-400 pt-1">
                        <MapPin size={12} className="text-indigo-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{issue.location.address}</span>
                      </div>
                    )}

                    {issue.photos?.[0] && (
                      <div className="w-full h-24 rounded-lg overflow-hidden border border-white/10 mt-1">
                        <img 
                          src={issue.photos[0]} 
                          alt="Evidence" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <ThumbsUp size={12} /> {issue.upvotes?.length || 0} votes
                      </span>
                      <span className="text-[10px]">
                        {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Floating Bottom Center Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] flex gap-3 pointer-events-auto">
        <button 
          onClick={handleGetLocation}
          disabled={locating}
          className="glass px-5 py-2.5 rounded-2xl flex items-center gap-2.5 text-white text-xs font-bold border border-white/10 hover:bg-white/10 shadow-xl transition-all cursor-pointer"
        >
          <Navigation size={16} className={`text-indigo-400 ${locating ? 'animate-spin' : ''}`} />
          {locating ? 'Detecting GPS...' : 'My Location'}
        </button>
        <button 
          onClick={handleFocusCity}
          className="bg-indigo-600 px-5 py-2.5 rounded-2xl flex items-center gap-2.5 text-white text-xs font-bold shadow-[0_0_25px_rgba(79,70,229,0.5)] hover:bg-indigo-500 hover:scale-105 transition-all cursor-pointer"
        >
          <MapPin size={16} /> Focus: Vadodara
        </button>
      </div>

      {/* Top Right Info Badge */}
      <div className="absolute top-6 right-6 z-[1000] pointer-events-auto hidden sm:block">
        <div className="glass px-4 py-2.5 rounded-2xl border border-white/10 flex items-center gap-2.5 text-xs font-medium text-slate-300 shadow-xl">
          <Info size={16} className="text-indigo-400 shrink-0" />
          <span>Click any marker to inspect community reports</span>
        </div>
      </div>
    </div>
  );
};

export default MapView;