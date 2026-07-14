import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, Shield, Smartphone, Briefcase, ExternalLink, 
  Sparkles, Sun, Moon, User, Download, X, Loader2, FileText
} from 'lucide-react';

import travelerLogo from './assets/traveler portal.jpg';
import agentLogo from './assets/agent portal.png';
import driverLogo from './assets/driver portal.png';
import adminLogo from './assets/admin portal.png';

// --- Custom GitHub Icon (Lucide v1.0 removed brand icons) ---
const Github = ({ size = 24, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// --- Global CSS & Animations ---
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    :root {
      /* Light Theme Variables */
      --primary: #4F46E5;
      --accent: #06B6D4;
      --secondary: #8B5CF6;
      --bg-main: #f8fafc;
      --glass: rgba(0, 0, 0, 0.03);
      --glass-border: rgba(0, 0, 0, 0.08);
      --glass-hover: rgba(0, 0, 0, 0.06);
      --glass-border-hover: rgba(79, 70, 229, 0.4);
      --grid-color: rgba(0, 0, 0, 0.04);
    }

    .dark {
      /* Dark Theme Variables */
      --bg-main: #030712;
      --glass: rgba(255, 255, 255, 0.03);
      --glass-border: rgba(255, 255, 255, 0.08);
      --glass-hover: rgba(255, 255, 255, 0.06);
      --glass-border-hover: rgba(79, 70, 229, 0.4);
      --grid-color: rgba(255, 255, 255, 0.02);
    }

    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--bg-main);
      color: var(--text-main);
      overflow-x: hidden;
      margin: 0;
      -webkit-font-smoothing: antialiased;
      transition: background-color 0.5s ease;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: var(--bg-main); }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
    .dark ::-webkit-scrollbar-thumb { background: #1f2937; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    .dark ::-webkit-scrollbar-thumb:hover { background: #374151; }

    /* Glassmorphism Cards */
    .glass-card {
      background: linear-gradient(145deg, var(--glass) 0%, transparent 100%);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .glass-card:hover {
      background: var(--glass-hover);
      border-color: var(--glass-border-hover);
      transform: translateY(-4px);
      box-shadow: 0 12px 40px -10px rgba(79, 70, 229, 0.15);
    }

    /* Background Effects */
    .bg-grid {
      background-size: 40px 40px;
      background-image: linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
                        linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px);
      mask-image: radial-gradient(circle at center, black 50%, transparent 100%);
      -webkit-mask-image: radial-gradient(circle at center, black 50%, transparent 100%);
      transition: background-image 0.5s ease;
    }

    @keyframes blob {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    
    .animate-blob {
      animation: blob 10s infinite cubic-bezier(0.4, 0, 0.2, 1);
    }
    .animation-delay-2000 { animation-delay: 2s; }
    .animation-delay-4000 { animation-delay: 4s; }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .animate-fadeIn {
      animation: fadeIn 0.2s ease-out forwards;
    }
  `}} />
);

// --- Custom Hooks for Reveal Animations ---
const useScrollReveal = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (options.triggerOnce !== false) observer.unobserve(entry.target);
      }
    }, { threshold: options.threshold || 0.1, rootMargin: "0px 0px -20px 0px" });

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, [options.threshold, options.triggerOnce]);

  return [ref, isVisible];
};

const Reveal = ({ children, delay = 0, className = '' }) => {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- Main Components ---

const PortalCard = ({ title, desc, link, logo, delay }) => (
  <Reveal delay={delay} className="h-full">
    <div className="glass-card rounded-2xl p-8 flex flex-col h-full group relative overflow-hidden">
      
      {/* Subtle background glow on hover */}
      <div className="absolute -inset-24 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-cyan-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl rounded-full pointer-events-none"></div>

      <div className="relative z-10 flex-grow">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-white group-hover:bg-indigo-50 dark:group-hover:bg-[#4F46E5]/20 group-hover:border-indigo-200 dark:group-hover:border-[#4F46E5]/50 transition-all duration-300">
            <img 
              src={logo} 
              alt={`${title} Logo`}
              className="w-full h-full object-contain p-1 rounded-[inherit]"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight transition-colors">{title}</h3>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8 transition-colors">
          {desc}
        </p>
      </div>

      <div className="relative z-10 mt-auto pt-4 border-t border-black/5 dark:border-white/5 transition-colors">
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center justify-between w-full px-4 py-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] hover:bg-black dark:hover:bg-white text-gray-700 dark:text-gray-300 hover:text-white dark:hover:text-black font-medium text-sm transition-all duration-300 border border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white group/btn"
        >
          <span>Open Portal</span>
          <ExternalLink size={16} className="text-gray-500 group-hover/btn:text-gray-400 dark:group-hover/btn:text-gray-600 transition-colors" />
        </a>
      </div>
    </div>
  </Reveal>
);

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [showResume, setShowResume] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(true);

  // Apply dark mode class to document HTML
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Reset loading state when modal opens
  useEffect(() => {
    if (showResume) {
      setIsPdfLoading(true);
    }
  }, [showResume]);

  // Handle keyboard accessibility (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowResume(false);
      }
    };
    if (showResume) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showResume]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (showResume) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showResume]);

  const portals = [
    {
      title: "Traveler Portal",
      desc: "Book trips, manage bookings, payments, QR boarding, wallet, profile, and travel history.",
      logo: travelerLogo,
      link: "https://traveloop-v2.vercel.app/"
    },
    {
      title: "Agent Portal",
      desc: "Create and manage trips, itineraries, packages, passengers, pricing, and bookings.",
      logo: agentLogo,
      link: "https://traveloop-v2-x92b.vercel.app/"
    },
    {
      title: "Driver Portal",
      desc: "Verify passengers using QR codes, manage boarding, attendance, and trip status.",
      logo: driverLogo,
      link: "https://agent-traveloop.vercel.app/"
    },
    {
      title: "Admin Portal",
      desc: "Manage users, agents, drivers, approvals, analytics, reports, and platform administration.",
      logo: adminLogo,
      link: "https://traveloop-v2-yj2k.vercel.app/"
    }
  ];

  return (
    <>
      <GlobalStyles />
      <div className="min-h-screen flex flex-col relative selection:bg-[#4F46E5]/30">
        
        {/* Top Controls: Links & Theme Toggle */}
        <div className="absolute top-6 right-6 md:top-8 md:right-8 z-50 flex items-center gap-3 md:gap-4 flex-wrap justify-end">
          
          {/* Download APK */}
          <a 
            href="https://drive.google.com/file/d/1nkNiTgdoP1Swkpo9VChvfD8dd7FB8J8L/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 md:w-12 md:h-12 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center bg-transparent transition-all duration-300 hover:border-black/40 dark:hover:border-white/40 hover:bg-black/5 dark:hover:bg-white/5 hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Download APK"
            title="Download APK"
          >
            <Download size={20} className="text-gray-800 dark:text-gray-200" />
          </a>
          
          {/* Resume */}
          <button 
            onClick={() => setShowResume(true)}
            className="w-11 h-11 md:w-12 md:h-12 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center bg-transparent transition-all duration-300 hover:border-black/40 dark:hover:border-white/40 hover:bg-black/5 dark:hover:bg-white/5 hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Resume"
            title="Resume"
          >
            <FileText size={20} className="text-gray-800 dark:text-gray-200" />
          </button>
          
          {/* View Portfolio */}
          <a 
            href="https://portfolio-drab-beta-95.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 md:w-12 md:h-12 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center bg-transparent transition-all duration-300 hover:border-black/40 dark:hover:border-white/40 hover:bg-black/5 dark:hover:bg-white/5 hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="View Portfolio"
            title="View Portfolio"
          >
            <User size={20} className="text-gray-800 dark:text-gray-200" />
          </a>
          
          {/* GitHub */}
          <a 
            href="https://github.com/sanjai0305/traveloop_V2"
            onClick={(e) => {
              e.preventDefault();
              window.open(
                "https://github.com/sanjai0305/traveloop_V2",
                "_blank",
                "noopener,noreferrer"
              );
            }}
            className="w-11 h-11 md:w-12 md:h-12 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center bg-transparent transition-all duration-300 hover:border-black/40 dark:hover:border-white/40 hover:bg-black/5 dark:hover:bg-white/5 hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="View on GitHub"
            title="View on GitHub"
          >
            <Github size={20} className="text-gray-800 dark:text-gray-200" />
          </a>
          
          {/* Theme Toggle */}
          <button 
            onClick={() => setIsDark(!isDark)}
            className="w-11 h-11 md:w-12 md:h-12 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center bg-transparent transition-all duration-300 hover:border-black/40 dark:hover:border-white/40 hover:bg-black/5 dark:hover:bg-white/5 hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Sun size={20} className="text-yellow-400" />
            ) : (
              <Moon size={20} className="text-indigo-600" />
            )}
          </button>
        </div>

        {/* Background Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid opacity-30 dark:opacity-20 transition-opacity duration-500"></div>
          <div className="absolute -top-[10%] -left-[10%] w-[40vw] h-[40vw] bg-[#4F46E5] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] dark:blur-[150px] opacity-10 dark:opacity-20 animate-blob transition-all duration-500"></div>
          <div className="absolute top-[20%] -right-[10%] w-[35vw] h-[35vw] bg-[#06B6D4] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] dark:blur-[150px] opacity-10 dark:opacity-20 animate-blob animation-delay-2000 transition-all duration-500"></div>
          <div className="absolute -bottom-[10%] left-[20%] w-[40vw] h-[40vw] bg-[#8B5CF6] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] dark:blur-[150px] opacity-10 dark:opacity-15 animate-blob animation-delay-4000 transition-all duration-500"></div>
        </div>

        {/* Main Content */}
        <main className="flex-grow flex flex-col justify-center relative z-10 pt-28 pb-16 px-6">
          <div className="container mx-auto max-w-5xl">
            
            {/* Header Section */}
            <div className="text-center mb-16 md:mb-24">
              <Reveal delay={100}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-md text-xs font-semibold mb-8 text-gray-700 dark:text-gray-300 tracking-wide uppercase transition-colors">
                  <Sparkles size={14} className="text-[#06B6D4]" />
                  Project Launcher
                </div>
              </Reveal>
              
              <Reveal delay={200}>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-tight">
                  <span className="block text-gray-900 dark:text-white transition-colors">TravelLoop V2</span>
                </h1>
              </Reveal>

              <Reveal delay={300}>
                <h2 className="text-xl md:text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-400 dark:from-gray-200 dark:to-gray-500 mb-6 max-w-3xl mx-auto transition-colors">
                  AI-Powered Smart Travel Management Platform
                </h2>
              </Reveal>
              
              <Reveal delay={400}>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-2xl mx-auto transition-colors">
                  TravelLoop V2 is a complete travel management ecosystem consisting of four independent portals working together through a shared backend. Select a portal below to access the live application.
                </p>
              </Reveal>
            </div>

            {/* Portals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {portals.map((portal, idx) => (
                <PortalCard 
                  key={idx} 
                  {...portal} 
                  delay={500 + (idx * 150)} 
                />
              ))}
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-black/5 dark:border-white/5 bg-white/40 dark:bg-black/20 backdrop-blur-lg mt-auto transition-colors duration-500">
          <div className="container mx-auto px-6 py-8 text-center flex flex-col items-center">
            <Reveal delay={800} className="w-full">
              <div className="mb-2 font-bold text-gray-900 dark:text-white tracking-tight text-lg transition-colors">
                TravelLoop V2
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 transition-colors">
                Developed by <a href="https://portfolio-drab-beta-95.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-gray-800 dark:text-gray-200 font-semibold hover:text-[#4F46E5] dark:hover:text-[#06B6D4] transition-colors">Sanjai R</a>
              </div>
              <div className="text-xs text-gray-500 mb-3 transition-colors">
                B.E Computer Science and Engineering (AI & ML)
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-600 font-mono transition-colors">
                {new Date().getFullYear()}
              </div>
            </Reveal>
          </div>
        </footer>

        {/* Resume Viewer Modal */}
        {showResume && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="glass-card w-full max-w-5xl h-[85vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl relative border border-black/10 dark:border-white/10">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 dark:bg-[#4F46E5]/20 text-indigo-600 dark:text-white rounded-lg border border-indigo-100 dark:border-[#4F46E5]/30">
                    <Briefcase size={18} strokeWidth={2} />
                  </div>
                  <h3 id="modal-title" className="text-lg font-bold text-gray-900 dark:text-white tracking-tight transition-colors">
                    Sanjai R - Resume
                  </h3>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {/* Download */}
                  <a
                    href="/resume.pdf"
                    download="Sanjai_R_Resume.pdf"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] hover:bg-black dark:hover:bg-white text-gray-700 dark:text-gray-300 hover:text-white dark:hover:text-black font-semibold text-xs transition-all duration-300 border border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white"
                    title="Download Resume"
                  >
                    <Download size={14} />
                    <span className="hidden md:inline">Download</span>
                  </a>

                  {/* Open in New Tab */}
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] hover:bg-black dark:hover:bg-white text-gray-700 dark:text-gray-300 hover:text-white dark:hover:text-black font-semibold text-xs transition-all duration-300 border border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white"
                    title="Open in New Tab"
                  >
                    <ExternalLink size={14} />
                    <span className="hidden md:inline">Open in New Tab</span>
                  </a>

                  {/* Close */}
                  <button
                    onClick={() => setShowResume(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                    aria-label="Close viewer"
                    title="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Body / PDF Viewer */}
              <div className="flex-grow w-full relative bg-gray-50/50 dark:bg-gray-950/20 overflow-hidden">
                {/* Loading Indicator */}
                {isPdfLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/70 dark:bg-gray-950/70 backdrop-blur-sm z-10 transition-all duration-300">
                    <Loader2 size={32} className="animate-spin text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Loading Resume...</span>
                  </div>
                )}

                {/* PDF Iframe */}
                <iframe
                  src="/resume.pdf#view=FitH"
                  title="Resume PDF Viewer"
                  className="w-full h-full border-none"
                  onLoad={() => setIsPdfLoading(false)}
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
  
