import React, { useEffect, useState } from 'react';
import { useLanguageContext } from "@/lib/LanguageContext";
import { Truck, Shield, Clock, MapPin, Phone, Mail, ArrowRight, Star, Package, Users, Globe, CheckCircle, Zap, Rocket, Sparkles, Eye, Target, Award, Smartphone } from 'lucide-react';
import { IMAGES } from '@/assets/images';
export default function HomePage() {
  const {
    t
  } = useLanguageContext();
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return <div className="min-h-screen relative overflow-hidden bg-space-navy">
      {/* Ultra Modern Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Holographic Grid */}
        <div className="absolute inset-0 cyber-grid opacity-30"></div>
        
        {/* Floating Particles */}
        {Array.from({
        length: 20
      }).map((_, i) => <div key={i} className="particle bg-electric-500" style={{
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 4 + 1}px`,
        height: `${Math.random() * 4 + 1}px`,
        animationDelay: `${Math.random() * 8}s`,
        animationDuration: `${Math.random() * 10 + 8}s`
      }} />)}
        
        {/* Dynamic Network Visualization */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ultraNetworkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8" />
              <stop offset="33%" stopColor="#8b5cf6" stopOpacity="0.6" />
              <stop offset="66%" stopColor="#ff006e" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#ffcc00" stopOpacity="0.5" />
            </linearGradient>
            <filter id="ultraGlow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge> 
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Dynamic Network Lines */}
          <line x1="0%" y1="20%" x2="100%" y2="80%" stroke="url(#ultraNetworkGradient)" strokeWidth="2" filter="url(#ultraGlow)" opacity="0.6">
            <animate attributeName="stroke-dasharray" values="0,300;150,150;300,0;0,300" dur="6s" repeatCount="indefinite" />
          </line>
          <line x1="20%" y1="100%" x2="80%" y2="0%" stroke="url(#ultraNetworkGradient)" strokeWidth="1.5" filter="url(#ultraGlow)" opacity="0.5">
            <animate attributeName="stroke-dasharray" values="0,250;125,125;250,0;0,250" dur="4s" repeatCount="indefinite" />
          </line>
          <line x1="0%" y1="60%" x2="100%" y2="40%" stroke="url(#ultraNetworkGradient)" strokeWidth="1" filter="url(#ultraGlow)" opacity="0.4">
            <animate attributeName="stroke-dasharray" values="0,200;100,100;200,0;0,200" dur="8s" repeatCount="indefinite" />
          </line>
          
          {/* Pulsing Network Nodes */}
          <circle cx="25%" cy="25%" r="3" fill="#00d4ff" filter="url(#ultraGlow)" opacity="0.8">
            <animate attributeName="r" values="2;6;2" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="75%" cy="75%" r="2" fill="#8b5cf6" filter="url(#ultraGlow)" opacity="0.7">
            <animate attributeName="r" values="1;4;1" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="50%" cy="50%" r="4" fill="#ff006e" filter="url(#ultraGlow)" opacity="0.9">
            <animate attributeName="r" values="3;7;3" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
        
        {/* Mouse-following Glow */}
        <div className="absolute w-96 h-96 rounded-full pointer-events-none" style={{
        left: mousePosition.x - 192,
        top: mousePosition.y - 192,
        background: 'radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
        transition: 'all 0.3s ease'
      }} />
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10">
        {/* Ultra Modern Header */}
        <header className="bg-space-navy/80 backdrop-blur-xl border-b border-electric-500/20 text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={IMAGES.BRITIUM_LOGO_55 || "/images/britium-logo.png"} alt="Britium Express" className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-500/20 to-neon-purple/20 p-2" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-matrix-green rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="font-cyber text-xl gradient-text">BRITIUM EXPRESS</h1>
                  <p className="text-xs text-electric-300">Next-Gen Logistics</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-electric-300">
                  <Phone className="w-4 h-4" />
                  <span>+95-9-897447744</span>
                </div>
                <div className="flex items-center gap-2 text-electric-300">
                  <Mail className="w-4 h-4" />
                  <span>info@britiumexpress.com</span>
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-electric-500/20 to-neon-purple/20 rounded-lg border border-electric-500/30">
                  <span className="text-electric-200">24/7 ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Futuristic Navigation */}
        <nav className="bg-deep-blue/60 backdrop-blur-xl border-b border-electric-500/10 sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <a href="/" className="font-modern font-semibold text-electric-400 hover:text-electric-300 transition-colors relative group">
                  HOME
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-electric-400 group-hover:w-full transition-all duration-300"></div>
                </a>
                <a href="/shipping-calculator" className="font-modern text-gray-300 hover:text-electric-400 transition-colors">CALCULATE</a>
                <a href="/services" className="font-modern text-gray-300 hover:text-electric-400 transition-colors">SERVICES</a>
                <a href="/merchant-registration" className="font-modern text-gray-300 hover:text-electric-400 transition-colors">REGISTER</a>
                <a href="/about" className="font-modern text-gray-300 hover:text-electric-400 transition-colors">ABOUT</a>
                <a href="/contact" className="font-modern text-gray-300 hover:text-electric-400 transition-colors">CONTACT</a>
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = '/"D:\Britium Express\logistics_platform (4)\android\app\build\outputs\apk\debug\app-debug.apk"';
                    link.download = 'app-debug.apk';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="font-modern text-matrix-green hover:text-electric-400 transition-colors flex items-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  MOBILE APP
                </button>
              </div>
              <a href="/login" className="btn-holographic">
                ACCESS PORTAL
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Section - Ultra Modern */}
        <section className="relative py-32 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto text-center">
              <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-electric-500/20 to-neon-purple/20 rounded-full border border-electric-500/30 mb-8">
                  <Sparkles className="w-5 h-5 text-electric-400" />
                  <span className="font-modern text-electric-300 text-sm font-medium">NEXT-GENERATION LOGISTICS PLATFORM</span>
                  <Sparkles className="w-5 h-5 text-electric-400" />
                </div>
                
                <h1 className="text-6xl md:text-8xl font-cyber font-black mb-8 leading-tight">
                  <span className="gradient-text">BRITIUM</span>
                  <br />
                  <span className="neon-text">EXPRESS</span>
                  <br />
                  <span className="text-white">DELIVERY</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto font-modern">
                  Experience the future of logistics with our AI-powered delivery network. 
                  Lightning-fast, ultra-secure, and powered by cutting-edge technology.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-6 mb-16">
                <button className="btn-holographic text-lg px-12 py-4 font-cyber">
                  <Rocket className="w-6 h-6 mr-3" />
                  LAUNCH DELIVERY
                </button>
                <button className="cyber-card px-12 py-4 text-electric-400 font-modern font-semibold hover:text-white transition-colors">
                  <Eye className="w-6 h-6 mr-3 inline" />
                  TRACK PACKAGE
                </button>
              </div>

              {/* Ultra Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="cyber-card text-center floating-element">
                  <div className="text-4xl font-cyber gradient-text mb-2">50K+</div>
                  <div className="text-electric-300 font-modern text-sm">MONTHLY DELIVERIES</div>
                </div>
                <div className="cyber-card text-center floating-element" style={{
                animationDelay: '1s'
              }}>
                  <div className="text-4xl font-cyber gradient-text mb-2">99.9%</div>
                  <div className="text-electric-300 font-modern text-sm">SUCCESS RATE</div>
                </div>
                <div className="cyber-card text-center floating-element" style={{
                animationDelay: '2s'
              }}>
                  <div className="text-4xl font-cyber gradient-text mb-2">24/7</div>
                  <div className="text-electric-300 font-modern text-sm">AI MONITORING</div>
                </div>
                <div className="cyber-card text-center floating-element" style={{
                animationDelay: '3s'
              }}>
                  <div className="text-4xl font-cyber gradient-text mb-2">5000+</div>
                  <div className="text-electric-300 font-modern text-sm">HAPPY CLIENTS</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ultra Modern Services */}
        <section className="py-24 holographic-bg">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-5xl font-cyber gradient-text mb-6">
                  QUANTUM ROUTES
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto font-modern">
                  Our AI-optimized delivery network connects Myanmar's major cities with unprecedented speed and precision.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="cyber-card group hover:scale-105 transition-all duration-500">
                  <div className="w-20 h-20 bg-gradient-to-br from-electric-500 to-neon-purple rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-cyber neon-text mb-4 text-center">
                    YANGON FLASH
                  </h3>
                  <p className="text-electric-300 mb-6 text-center font-modern">Same-day delivery within Yangon using quantum-speed routing</p>
                  <div className="text-center">
                    <span className="px-4 py-2 bg-gradient-to-r from-matrix-green/20 to-electric-500/20 rounded-full text-matrix-green font-cyber text-sm">
                      SAME DAY
                    </span>
                  </div>
                </div>

                <div className="cyber-card group hover:scale-105 transition-all duration-500">
                  <div className="w-20 h-20 bg-gradient-to-br from-neon-purple to-holographic-pink rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-cyber neon-text mb-4 text-center">
                    MANDALAY EXPRESS
                  </h3>
                  <p className="text-electric-300 mb-6 text-center font-modern">Ultra-fast overnight service with real-time tracking</p>
                  <div className="text-center">
                    <span className="px-4 py-2 bg-gradient-to-r from-neon-purple/20 to-holographic-pink/20 rounded-full text-neon-purple font-cyber text-sm">
                      NEXT DAY
                    </span>
                  </div>
                </div>

                <div className="cyber-card group hover:scale-105 transition-all duration-500">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyber-gold to-plasma-orange rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform">
                    <Award className="w-10 h-10 text-space-navy" />
                  </div>
                  <h3 className="text-2xl font-cyber neon-text mb-4 text-center">
                    CAPITAL SECURE
                  </h3>
                  <p className="text-electric-300 mb-6 text-center font-modern">Premium service to Nay Pyi Taw with military-grade security</p>
                  <div className="text-center">
                    <span className="px-4 py-2 bg-gradient-to-r from-cyber-gold/20 to-plasma-orange/20 rounded-full text-cyber-gold font-cyber text-sm">
                      PREMIUM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Showcase */}
        <section className="py-24 bg-deep-blue/40 backdrop-blur-xl">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-5xl font-cyber gradient-text mb-8">
                    POWERED BY AI
                  </h2>
                  
                  <div className="space-y-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-electric-500 to-neon-purple rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Truck className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-cyber neon-text mb-3">SMART ROUTING</h3>
                        <p className="text-electric-300 font-modern text-lg">
                          AI algorithms optimize every delivery route in real-time for maximum efficiency.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-neon-purple to-holographic-pink rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-cyber neon-text mb-3">QUANTUM SECURITY</h3>
                        <p className="text-electric-300 font-modern text-lg">
                          Military-grade encryption and blockchain tracking ensure absolute package security.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyber-gold to-plasma-orange rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-8 h-8 text-space-navy" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-cyber neon-text mb-3">REAL-TIME SYNC</h3>
                        <p className="text-electric-300 font-modern text-lg">
                          Live tracking with microsecond precision updates across all platforms.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="cyber-card p-8">
                    <img src={IMAGES.SCREENSHOT3252_118 || "/images/Screenshot3252.png"} alt="AI Dashboard" className="w-full h-80 object-cover rounded-xl mb-6" />
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        {Array.from({
                        length: 5
                      }).map((_, i) => <Star key={i} className="w-6 h-6 text-cyber-gold fill-current" />)}
                      </div>
                      <p className="text-electric-300 italic font-modern text-lg">
                        "Britium Express has revolutionized our supply chain with their quantum-speed delivery network."
                      </p>
                      <p className="text-neon-purple font-cyber text-sm mt-3">- FUTURE TECH CORP</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ultra CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 holographic-bg"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-6xl font-cyber gradient-text mb-8">
                READY TO LAUNCH?
              </h2>
              <p className="text-2xl text-electric-300 mb-12 font-modern">
                Experience the future of logistics today.
              </p>
              <button className="btn-holographic text-2xl px-16 py-6 font-cyber">
                <Rocket className="w-8 h-8 mr-4" />
                INITIATE DELIVERY
              </button>
            </div>
          </div>
        </section>

        {/* Futuristic Footer */}
        <footer className="bg-space-navy/90 backdrop-blur-xl border-t border-electric-500/20 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
              <div>
                <h3 className="text-3xl font-cyber gradient-text mb-6">BRITIUM EXPRESS</h3>
                <p className="text-electric-300 mb-8 font-modern text-lg">
                  Next-generation logistics powered by AI, secured by quantum technology, 
                  delivered with Myanmar's premium standard.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-matrix-green/20 to-electric-500/20 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-matrix-green" />
                  </div>
                  <div>
                    <div className="font-cyber text-matrix-green text-lg">QUANTUM CERTIFIED</div>
                    <div className="text-electric-300 font-modern">Ultra-secure logistics provider</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-cyber text-electric-400 text-xl mb-8">QUICK ACCESS</h4>
                <div className="space-y-4">
                  <a href="/track" className="block text-gray-300 hover:text-electric-400 transition-colors flex items-center gap-3 font-modern">
                    <Package className="w-5 h-5" />
                    Track Package
                  </a>
                  <a href="/services" className="block text-gray-300 hover:text-electric-400 transition-colors flex items-center gap-3 font-modern">
                    <Truck className="w-5 h-5" />
                    Services
                  </a>
                  <a href="/contact" className="block text-gray-300 hover:text-electric-400 transition-colors flex items-center gap-3 font-modern">
                    <Phone className="w-5 h-5" />
                    Contact
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-cyber text-electric-400 text-xl mb-8">CONNECT</h4>
                <div className="space-y-6 text-electric-300">
                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-electric-400 mt-1" />
                    <div>
                      <div className="font-cyber text-lg">+95-9-897447744</div>
                      <div className="text-sm font-modern">24/7 Quantum Hotline</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-electric-400 mt-1" />
                    <div>
                      <div className="font-modern text-lg">No. 277, East Dagon Township</div>
                      <div className="text-sm font-modern">Yangon, Myanmar</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-electric-400 mt-1" />
                    <div>
                      <div className="font-modern text-lg">info@britiumexpress.com</div>
                      <div className="text-sm font-modern">Quantum Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-electric-500/20 pt-8 text-center">
              <p className="text-electric-300 font-modern">
                © 2026 Britium Ventures Company Limited. All Rights Reserved. | Powered by Quantum Technology
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>;
}