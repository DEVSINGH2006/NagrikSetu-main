/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Zap, ExternalLink, Users, ChevronRight, Globe, Award, CheckCircle2 } from 'lucide-react';

const Landing = () => {
  // Reveal Animation Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const steps = [
    { 
      icon: <MapPin size={28} className="text-indigo-400" />, 
      title: 'Spot the Issue', 
      desc: 'See something that needs fixing? Snap a photo of potholes, garbage, or broken lights.' 
    },
    { 
      icon: <Zap size={28} className="text-emerald-400" />, 
      title: 'Instant Reporting', 
      desc: 'Our AI categorizes and routes your report directly to the concerned department.' 
    },
    { 
      icon: <ShieldCheck size={28} className="text-amber-400" />, 
      title: 'Civic Accountability', 
      desc: 'Track the resolution progress in real-time and hold authorities accountable.' 
    }
  ];

  const StatBox = ({ end, label, icon: Icon }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) { clearInterval(timer); setCount(end); }
        else { setCount(Math.floor(start)); }
      }, 16);
      return () => clearInterval(timer);
    }, [end]);

    return (
      <div className="glass p-6 rounded-3xl flex items-center gap-5 border border-white/5 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
          <Icon size={24} />
        </div>
        <div>
          <h4 className="text-2xl font-bold">{count.toLocaleString()}+</h4>
          <p className="text-slate-400 text-sm">{label}</p>
        </div>
      </div>
    );
  };

  const WavingFlag = ({ size = "md" }) => {
    const dimensions = size === "lg" ? "w-24 h-16" : "w-10 h-7";
    return (
      <div className={`${dimensions} relative overflow-hidden rounded-sm shadow-lg border border-white/5`}>
        <motion.div 
          className="w-full h-full flex flex-col"
          animate={{ 
            skewY: [-1, 1, -1],
            rotateX: [-2, 2, -2],
            x: [-1, 1, -1]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <div className="flex-1 bg-[#FF9933]"></div>
          <div className="flex-1 bg-[#FFFFFF] flex items-center justify-center">
            <div className="w-[30%] aspect-square rounded-full border border-[#000080] relative animate-spin [animation-duration:10s]">
              {Array.from({length: 24}).map((_, i) => (
                <div key={i} className="absolute top-1/2 left-1/2 w-full h-[1px] bg-[#000080]" style={{ transform: `translate(-50%, -50%) rotate(${i * 15}deg)` }}></div>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-[#128807]"></div>
        </motion.div>
        {/* Wave Overlay Shadow */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent pointer-events-none"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  };

  const GlassyIndia = () => {
    return (
      <motion.div 
        className="relative w-full aspect-square max-w-lg mx-auto preserve-3d group"
        initial={{ rotateY: -20, rotateX: 10 }}
        whileHover={{ rotateY: 5, rotateX: -5, scale: 1.05 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* Layer 1: Back Glow */}
        <div className="absolute inset-0 bg-indigo-500/20 blur-[80px] rounded-full group-hover:bg-indigo-500/30 transition-colors"></div>
        
        {/* Layer 2: Deepest Shadow Map */}
        <div className="absolute inset-0 translate-z-[-50px] opacity-20 filter blur-sm">
          <img src="https://cdn.pixabay.com/photo/2013/07/12/12/55/india-146522_1280.png" className="w-full h-full object-contain invert grayscale" alt="India Map Shadow" />
        </div>

        {/* Layer 3: Glass Outline & Realistic Map */}
        <div className="absolute inset-0 glass rounded-[3rem] border border-white/10 backdrop-blur-3xl shadow-2xl flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-white/10 opacity-30"></div>
          
          {/* Realistic 3D India Map (Replaced Abstract SVG) */}
          <div className="relative w-[90%] h-[90%] flex items-center justify-center">
            <img 
              src="/india_3d_map.png" // The user's realistic photo
              alt="Realistic 3D India Map"
              className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(99,102,241,0.4)]"
            />
            
            {/* Overlay National Connections Dots on Realistic Terrain */}
            <div className="absolute inset-0 z-10">
              {[
                {x: '50%', y: '30%'}, {x: '40%', y: '55%'}, {x: '60%', y: '65%'}, {x: '48%', y: '78%'}, {x: '35%', y: '40%'}
              ].map((p, i) => (
                <div 
                  key={i} 
                  className="absolute w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_15px_#10B981] animate-ping" 
                  style={{ top: p.y, left: p.x, animationDelay: `${i * 0.5}s` }} 
                />
              ))}
            </div>
          </div>

          {/* Glass Text Overlay */}
          <div className="absolute bottom-12 text-center z-20">
            <h3 className="text-4xl font-black text-white tracking-widest leading-none drop-shadow-lg">INDIA</h3>
            <div className="h-1 w-24 bg-gradient-to-r from-emerald-400 to-indigo-400 mx-auto mt-4 rounded-full shadow-lg"></div>
          </div>
        </div>

        {/* Floating Waving Flag */}
        <div className="absolute -top-10 -right-10 flex flex-col items-center gap-2 translate-z-[120px] group-hover:scale-110 transition-transform">
          <div className="w-1 h-32 bg-gradient-to-b from-slate-400 to-slate-800 rounded-full shadow-2xl relative">
            <div className="absolute top-0 right-0 origin-top-left -translate-y-1">
              <WavingFlag size="lg" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 bg-slate-900/50 px-2 py-1 rounded-md">National Pride</p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen bg-[#0F172A] text-slate-100 overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-emerald-600/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-8">
              <Award size={14} /> India's #1 Civic Accountability Platform
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Transforming <span className="text-gradient">India</span>,<br />
              One Report at a Time.
            </h1>
            
            <p className="text-xl text-slate-400 max-w-2xl lg:mx-0 mx-auto mb-10 leading-relaxed">
              Empowering citizens to build a smarter, cleaner city through transparent reporting and AI-driven accountability.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 lg:justify-start justify-center">
              <Link to="/report" className="px-8 py-4 rounded-2xl bg-[var(--color-primary)] text-white font-bold text-lg hover:shadow-[0_20px_40px_rgba(99,102,241,0.3)] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1">
                Report an Issue <ChevronRight size={20} />
              </Link>
              <Link to="/community" className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-md">
                View Community Feed <Globe size={18} />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            className="flex-1 relative"
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Hero Image / High-End 4K Visual Section */}
            <div className="relative z-10 rounded-[3rem] overflow-hidden border-2 border-white/10 shadow-[0_0_50px_rgba(99,102,241,0.3)] bg-slate-900 group">
              <img 
                src="/vadodara_palace.png" 
                alt="Laxmi Vilas Palace, Vadodara - 4K Heritage"
                className="w-full aspect-[16/10] object-cover contrast-[1.1] saturate-[1.2] brightness-105 transition-all duration-1000 group-hover:scale-105"
                onLoad={(e) => e.target.style.opacity = 1}
                style={{ opacity: 0 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-80"></div>
              
              {/* Floating Status Badge */}
              <div className="absolute top-8 right-8 glass px-6 py-2.5 rounded-full text-[10px] font-bold text-white uppercase tracking-[0.3em] border border-white/20 shadow-2xl animate-pulse">
                National Heritage Portal
              </div>
            </div>
            {/* Floating UI Element */}
            <div className="absolute -bottom-6 -left-6 glass p-5 rounded-2xl border border-white/10 shadow-2xl max-w-[200px] animate-bounce-slow">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-tighter">Live Status</span>
              </div>
              <p className="text-xs text-slate-300 leading-tight">142 issues resolved in Vadodara today.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="px-6 max-w-7xl mx-auto pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatBox icon={Users} end={25400} label="Active Citizens" />
          <StatBox icon={CheckCircle2} end={18900} label="Issues Resolved" />
          <StatBox icon={MapPin} end={45} label="Wards Covered" />
          <StatBox icon={Zap} end={98} label="Success Rate (%)" />
        </div>
      </section>

      {/* India Map Feature Section (Glassy 3D Redesign) */}
      <section className="relative py-40 overflow-hidden bg-white/5 border-y border-white/5 perspective-[2000px]">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
          <div className="relative order-2 lg:order-1">
            <GlassyIndia />
          </div>

          <div className="flex flex-col gap-10 order-1 lg:order-2">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tighter">
                One <span className="text-emerald-400 italic font-serif">India</span>. <br />
                National <span className="text-gradient">Unity</span>.
              </h2>
              <p className="text-xl text-slate-400 leading-relaxed max-w-xl">
                The 3D Glass Network is monitoring city health across the subcontinent. From Vadodara to Kanyakumari, every voice creates a ripple in our data crystal.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-8">
              {[
                { t: 'Smart Mapping', d: 'Interactive 3D coverage of every Indian ward.' },
                { t: 'Live Sync', d: 'Nationwide issue coordination system.' },
                { t: 'Glass Analytics', d: 'Transparent data visualization for all.' },
                { t: 'Citizen Trust', d: 'Secure end-to-end encrypted reporting.' }
              ].map((item, i) => (
                <div key={i} className="group">
                  <h5 className="font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">⚡ {item.t}</h5>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Modern Grid */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Three Steps to <span className="text-[var(--color-primary)]">Change</span></h2>
          <p className="text-slate-400 max-w-xl mx-auto">The simplest interface ever designed for civic participation.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -15 }}
              className="glass p-10 rounded-[3rem] text-center border border-white/5 relative overflow-hidden group"
            >
              <div className="w-20 h-20 rounded-[2rem] bg-indigo-500/10 flex items-center justify-center mb-8 mx-auto text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed">{step.desc}</p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 pb-12 px-6 border-t border-white/5 bg-slate-900/40">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <Link to="/" className="text-3xl font-bold font-serif flex items-center gap-2 mb-6">
              <span className="text-[var(--color-primary)]">Nagrik</span>
              <span className="text-white">Setu</span>
            </Link>
            <p className="text-slate-400 max-w-md leading-relaxed mb-8">
              India's leading platform for civic action and community intelligence. Together, we build the future of urban living.
            </p>
          </div>
          <div>
            <h5 className="text-white font-bold mb-6">Explore</h5>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><Link to="/map" className="hover:text-indigo-400">Civic Map</Link></li>
              <li><Link to="/community" className="hover:text-indigo-400">Community Feed</Link></li>
              <li><Link to="/assistant" className="hover:text-indigo-400">AI Assistant</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold mb-6">Company</h5>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-indigo-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-400">Contact Support</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between pt-8 border-t border-white/10 text-slate-500 text-xs">
          <p>© 2026 NagrikSetu India. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>Made with ❤️ for India</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;