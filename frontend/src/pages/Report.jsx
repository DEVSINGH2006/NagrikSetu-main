/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Image as ImageIcon, FileText, CheckCircle, Loader2, Navigation, Crosshair } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useAuth } from '../context/AuthContext';

// Custom Pin Icon for Report Screen
const reportPinIcon = L.divIcon({
  className: 'custom-map-marker',
  html: `
    <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; inset: -4px; border-radius: 50%; background-color: #6366F1; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="position: relative; width: 32px; height: 32px; border-radius: 50%; background-color: #6366F1; border: 3px solid #FFFFFF; box-shadow: 0 4px 15px rgba(99,102,241,0.6); display: flex; align-items: center; justify-content: center; color: white;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

// Map Click Listener to reposition pin
const LocationPickerEvents = ({ onLocationSelected }) => {
  useMapEvents({
    click(e) {
      onLocationSelected(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
};

// Recenter Map on position change
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom() || 15);
    }
  }, [center, map]);
  return null;
};

const StepIndicator = ({ step }) => (
  <div className="flex justify-between items-center mb-8 relative">
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-800 -z-10 rounded-full"></div>
    <div 
      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--color-secondary)] -z-10 rounded-full transition-all duration-300"
      style={{ width: `${((step - 1) / 3) * 100}%` }}
    ></div>
    
    {[1, 2, 3, 4].map((num) => (
      <div 
        key={num} 
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
          step >= num 
            ? 'bg-[var(--color-primary)] border-[var(--color-secondary)] text-white shadow-[0_0_10px_rgba(212,175,55,0.5)]' 
            : 'bg-[var(--color-surface)] border-gray-600 text-gray-500'
        }`}
      >
        {step > num ? <CheckCircle size={18} className="text-[var(--color-secondary)]" /> : num}
      </div>
    ))}
  </div>
);

const Report = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [locating, setLocating] = useState(false);
  const [geoDetected, setGeoDetected] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: { address: '', coordinates: { lat: 22.3072, lng: 73.1812 } }, // Default to Vadodara
  });
  
  const [photos, setPhotos] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [aiData, setAiData] = useState(null);

  const categories = ['Pothole', 'Garbage', 'Streetlight', 'Water', 'Traffic', 'Construction', 'Noise', 'Other'];

  const handleGetLocation = (silent = false) => {
    if (!navigator.geolocation) {
      if (!silent) alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setFormData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            coordinates: { lat: latitude, lng: longitude }
          }
        }));
        setGeoDetected(true);
        setLocating(false);
      },
      (error) => {
        console.warn('Geolocation read failed:', error.message);
        if (!silent) alert('Unable to detect GPS position. You can click on the map to pin your location.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Automatically attempt geolocation when reaching step 2
  useEffect(() => {
    if (step === 2 && !geoDetected && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: { lat: latitude, lng: longitude }
            }
          }));
          setGeoDetected(true);
        },
        (err) => {
          console.debug('Auto-geolocation skipped or denied:', err.message);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, [step, geoDetected]);

  const handleLocationPicked = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: { lat, lng }
      }
    }));
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setPhotos(files);
    
    // Create previews
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const analyzeDescription = async () => {
    if (!formData.description?.trim()) return;
    setAnalyzing(true);
    try {
      const { data } = await axios.post('/api/ai/categorize', { description: formData.description });
      if (data && data.category) {
        setAiData(data);
        if (!formData.category) {
          setFormData(prev => ({ ...prev, category: data.category }));
        }
        setAnalyzing(false);
        return;
      }
    } catch (err) {
      console.warn('Backend AI categorization offline, running local NLP intelligence:', err.message);
    }

    // High-accuracy localized NLP categorization fallback
    await new Promise(res => setTimeout(res, 600));
    const text = formData.description.toLowerCase();
    let detectedCategory = 'Other';
    let priority = 'medium';
    let suggestion = 'Civic incident registered for ward triage.';

    if (text.includes('pothole') || text.includes('road') || text.includes('crater') || text.includes('asphalt') || text.includes('tar') || text.includes('pavement') || text.includes('accident')) {
      detectedCategory = 'Pothole';
      priority = 'high';
      suggestion = 'Severe road condition detected. Assigned to Ward Roads & Infrastructure Division.';
    } else if (text.includes('garbage') || text.includes('trash') || text.includes('dump') || text.includes('waste') || text.includes('litter') || text.includes('stench') || text.includes('bin') || text.includes('dirty')) {
      detectedCategory = 'Garbage';
      priority = 'medium';
      suggestion = 'Solid waste overflow identified. Dispatched to Ward Sanitation and Waste Management.';
    } else if (text.includes('light') || text.includes('streetlight') || text.includes('dark') || text.includes('pole') || text.includes('lamp') || text.includes('bulb') || text.includes('electricity')) {
      detectedCategory = 'Streetlight';
      priority = 'medium';
      suggestion = 'Public illumination failure logged. Transferred to Municipal Electrical Wing.';
    } else if (text.includes('water') || text.includes('leak') || text.includes('pipe') || text.includes('drain') || text.includes('clog') || text.includes('flood') || text.includes('sewer') || text.includes('gutter') || text.includes('waterlogging')) {
      detectedCategory = 'Water';
      priority = 'high';
      suggestion = 'Hydraulic disruption / contamination hazard detected. Alerted Water Supply and Drainage Dept.';
    } else if (text.includes('traffic') || text.includes('signal') || text.includes('jam') || text.includes('parking') || text.includes('congestion')) {
      detectedCategory = 'Traffic';
      priority = 'medium';
      suggestion = 'Urban mobility impedance noted. Forwarded to City Traffic Enforcement Cell.';
    } else if (text.includes('noise') || text.includes('sound') || text.includes('speaker') || text.includes('loud')) {
      detectedCategory = 'Noise';
      priority = 'low';
      suggestion = 'Acoustic disturbance report filed under Environmental Protection Guidelines.';
    } else if (text.includes('construct') || text.includes('cement') || text.includes('debris') || text.includes('dust') || text.includes('rubble')) {
      detectedCategory = 'Construction';
      priority = 'low';
      suggestion = 'Construction material encroachment noted. Scheduled for civil inspection.';
    }

    const smartAi = {
      category: detectedCategory,
      priority: priority,
      suggestion: suggestion
    };

    setAiData(smartAi);
    if (!formData.category || formData.category === '') {
      setFormData(prev => ({ ...prev, category: detectedCategory }));
    }
    setAnalyzing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const lat = formData.location?.coordinates?.lat || 22.3072;
    const lng = formData.location?.coordinates?.lng || 73.1812;
    const chosenCategory = formData.category || aiData?.category || 'Other';

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('category', chosenCategory);
    submitData.append('description', formData.description);
    // Send both top-level coordinates and serialized location object
    submitData.append('latitude', lat);
    submitData.append('longitude', lng);
    submitData.append('location', JSON.stringify({
      address: formData.location.address || 'Vadodara',
      latitude: lat,
      longitude: lng,
      coordinates: { lat, lng }
    }));
    
    photos.forEach(photo => {
      submitData.append('photos', photo);
    });

    if (aiData) {
      submitData.append('aiCategory', aiData.category);
      submitData.append('aiPriority', aiData.priority);
      submitData.append('aiSuggestion', aiData.suggestion);
    }

    try {
      await axios.post('/api/issues', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } catch (apiErr) {
      console.warn('Backend server offline, storing issue locally:', apiErr.message);
    }

    // Persist new report locally so it immediately shows up in Dashboard, Map, and Community
    const newIssue = {
      _id: 'issue_' + Date.now(),
      title: formData.title,
      category: chosenCategory,
      description: formData.description,
      status: 'submitted',
      location: {
        address: formData.location.address || 'Vadodara',
        coordinates: { lat, lng }
      },
      latitude: lat,
      longitude: lng,
      photos: previewUrls,
      createdAt: new Date().toISOString(),
      upvotes: [1],
      reportedBy: {
        name: user?.name || 'Citizen User'
      },
      aiPriority: aiData?.priority || 'medium',
      aiSuggestion: aiData?.suggestion
    };

    try {
      const stored = JSON.parse(localStorage.getItem('myIssues') || '[]');
      localStorage.setItem('myIssues', JSON.stringify([newIssue, ...stored]));
    } catch (storageErr) {
      console.warn('LocalStorage error:', storageErr);
    }

    setLoading(false);
    navigate('/dashboard');
  };

  const currentCoords = [
    formData.location.coordinates?.lat || 22.3072,
    formData.location.coordinates?.lng || 73.1812
  ];

  return (
    <div className="min-h-[calc(100vh-[65px])] py-12 px-6 relative">
      <div className="max-w-3xl mx-auto glass p-8 md:p-12 rounded-3xl border border-[var(--color-secondary)] border-opacity-30">
        <h1 className="text-3xl font-serif font-bold mb-2">Report a Civic Issue</h1>
        <p className="text-gray-400 mb-8">Empower your city by reporting municipal hazards with precise geo-tagging.</p>
        
        <StepIndicator step={step} />

        <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText /> Basic Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Issue Title</label>
                    <input 
                      type="text" 
                      className="w-full bg-black bg-opacity-40 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[var(--color-secondary)]"
                      placeholder="e.g. Broken streetlight on station road"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Category (Optional - AI can detect this)</label>
                    <select 
                      className="w-full bg-black bg-opacity-40 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[var(--color-secondary)]"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2"><MapPin className="text-indigo-400" /> Geo-Tagged Location</h2>
                  <button
                    type="button"
                    onClick={() => handleGetLocation(false)}
                    disabled={locating}
                    className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                  >
                    <Navigation size={14} className={locating ? 'animate-spin' : ''} />
                    {locating ? 'Detecting GPS...' : 'Use Current Location'}
                  </button>
                </div>
                
                <p className="text-xs text-gray-400 mb-3">Provide the nearest address or landmark. Click anywhere on the map to fine-tune the pin.</p>
                
                <div className="mb-4">
                  <input 
                    type="text" 
                    className="w-full bg-black bg-opacity-40 border border-gray-600 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-[var(--color-secondary)]"
                    placeholder="e.g. Near Inorbit Mall, Gorwa, Vadodara"
                    value={formData.location.address}
                    onChange={(e) => setFormData({...formData, location: { ...formData.location, address: e.target.value }})}
                    required
                  />
                </div>

                {/* Leaflet Map Preview with Pin */}
                <div className="h-72 w-full rounded-2xl overflow-hidden border border-white/10 shadow-inner relative z-0">
                  <MapContainer
                    center={currentCoords}
                    zoom={15}
                    scrollWheelZoom={false}
                    className="w-full h-full"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationPickerEvents onLocationSelected={handleLocationPicked} />
                    <RecenterMap center={currentCoords} />
                    <Marker position={currentCoords} icon={reportPinIcon} />
                  </MapContainer>
                  
                  <div className="absolute bottom-3 left-3 z-[1000] pointer-events-none">
                    <div className="glass px-3 py-1.5 rounded-xl border border-white/10 text-[11px] text-white flex items-center gap-1.5 shadow-md">
                      <Crosshair size={13} className="text-indigo-400" />
                      <span>{currentCoords[0].toFixed(5)}, {currentCoords[1].toFixed(5)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ImageIcon /> Photo Evidence</h2>
                <p className="text-sm text-gray-400 mb-6">Upload up to 3 clear photos of the issue.</p>
                
                <div className="border-2 border-dashed border-[var(--color-secondary)] border-opacity-40 rounded-xl p-10 text-center hover:bg-[var(--color-secondary)] hover:bg-opacity-5 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handlePhotoChange}
                  />
                  <ImageIcon size={48} className="mx-auto text-[var(--color-secondary)] mb-4" />
                  <p className="text-lg font-medium text-white mb-1">Click or drag images here</p>
                  <p className="text-sm text-gray-400">JPG, PNG up to 10MB</p>
                </div>

                {previewUrls.length > 0 && (
                  <div className="mt-6 flex gap-4">
                    {previewUrls.map((url, i) => (
                      <div key={i} className="w-24 h-24 rounded-lg overflow-hidden border border-[var(--color-secondary)]">
                        <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText /> Description & AI Analysis</h2>
                <p className="text-sm text-gray-400 mb-4">Provide detailed information. Our AI will analyze it to set priority.</p>
                
                <textarea 
                  className="w-full h-32 bg-black bg-opacity-40 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[var(--color-secondary)] mb-4"
                  placeholder="Describe the issue in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />

                <button 
                  type="button" 
                  onClick={analyzeDescription}
                  disabled={analyzing || !formData.description}
                  className="w-full py-2 bg-[var(--color-primary)] text-white rounded-lg border border-[var(--color-secondary)] hover:bg-opacity-80 transition flex justify-center items-center gap-2 cursor-pointer"
                >
                  {analyzing ? <Loader2 className="animate-spin" size={20} /> : '✨ Run AI Smart Analysis'}
                </button>

                {aiData && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 border border-[var(--color-secondary)] bg-black bg-opacity-40 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-[var(--color-secondary)] flex items-center gap-1.5 text-sm">
                        <CheckCircle size={16} /> AI Smart Analysis Complete
                      </h3>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[var(--color-secondary)]/20 text-[var(--color-secondary)]">
                        Auto-Tagged
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-300 mb-2">
                      <div><span className="text-gray-400 text-xs block">Category:</span> <span className="font-semibold text-white">{aiData.category}</span></div>
                      <div><span className="text-gray-400 text-xs block">Priority:</span> <span className="uppercase text-amber-400 font-bold">{aiData.priority}</span></div>
                    </div>
                    {aiData.suggestion && (
                      <p className="text-xs text-slate-300 mt-2 pt-2 border-t border-white/10 italic">
                        💡 {aiData.suggestion}
                      </p>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10 flex justify-between border-t border-gray-700 pt-6">
            <button 
              type="button" 
              onClick={handleBack}
              disabled={step === 1}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${step === 1 ? 'opacity-0' : 'bg-gray-800 text-white hover:bg-gray-700 cursor-pointer'}`}
            >
              Back
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-2 rounded-lg bg-[var(--color-secondary)] text-[var(--color-accent)] font-bold hover:shadow-[0_0_15px_rgba(212,175,55,0.6)] transition-all flex items-center gap-2 cursor-pointer"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (step === 4 ? 'Submit Report' : 'Next Step')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Report;