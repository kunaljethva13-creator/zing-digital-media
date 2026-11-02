import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, LogOut, ArrowRight, ArrowLeft, CheckCircle, 
  Sparkles, Globe, TrendingUp, Video, Share2, 
  Phone, ChevronRight, X, Zap, PhoneCall, Clock
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedService, setSelectedService] = useState(null);
  const [logoClicks, setLogoClicks] = useState(0);

  // Authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Leads state with Name, Phone, Email, Service, Status
  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  // Consultation Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    service: 'Performance Marketing', 
    message: '' 
  });
  const [formSent, setFormSent] = useState(false);

  // Keyboard shortcut (Ctrl + Shift + A) aur Secret URL (?admin=true)
  useEffect(() => {
    const token = localStorage.getItem('agency_token');
    if (token) setIsLoggedIn(true);

    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setCurrentView('admin');
    }

    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setCurrentView((prev) => (prev === 'admin' ? 'home' : 'admin'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    if (newCount >= 5) {
      setCurrentView('admin');
      setLogoClicks(0);
    }
  };

  // Fetch leads
  const fetchLeads = async () => {
    setLoadingLeads(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/leads');
      const data = await res.json();
      if (data.success && data.leads) {
        setLeads(data.leads);
      } else {
        const local = JSON.parse(localStorage.getItem('saved_leads') || '[]');
        setLeads(local);
      }
    } catch {
      const local = JSON.parse(localStorage.getItem('saved_leads') || '[]');
      setLeads(local);
    } finally {
      setLoadingLeads(false);
    }
  };

  useEffect(() => {
    if (currentView === 'admin' && isLoggedIn) {
      fetchLeads();
    }
  }, [currentView, isLoggedIn]);

  // Lead submit handler
  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    const newLead = {
      id: Date.now(),
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      service: formData.service,
      message: formData.message,
      status: 'Pending', // Default status: Pending
      date: new Date().toLocaleDateString()
    };

    try {
      await fetch('http://localhost:5000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      });
    } catch {
      // Local fallback
    }

    const updated = [newLead, ...leads];
    setLeads(updated);
    localStorage.setItem('saved_leads', JSON.stringify(updated));

    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setShowModal(false);
      setFormData({ name: '', phone: '', email: '', service: 'Performance Marketing', message: '' });
    }, 1500);
  };

  // Toggle status between 'Pending' aur 'Reached'
  const toggleStatus = (id) => {
    const updated = leads.map((lead) => {
      if (lead.id === id || lead._id === id) {
        return {
          ...lead,
          status: lead.status === 'Reached' ? 'Pending' : 'Reached'
        };
      }
      return lead;
    });
    setLeads(updated);
    localStorage.setItem('saved_leads', JSON.stringify(updated));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'agency123') {
      localStorage.setItem('agency_token', 'active');
      setIsLoggedIn(true);
      setLoginError('');
      fetchLeads();
    } else {
      setLoginError('Invalid credentials (use admin / agency123)');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('agency_token');
    setIsLoggedIn(false);
    setCurrentView('home');
  };

  const totalInquiries = leads.length;
  const totalReached = leads.filter(l => l.status === 'Reached').length;

  const servicesData = [
    {
      id: 'performance-marketing',
      icon: <TrendingUp size={36} color="#38bdf8" />,
      accentColor: '#38bdf8',
      title: "Performance Marketing",
      shortDesc: "Drive measurable, high-ROI results through targeted paid campaigns that convert clicks into scalable revenue.",
      tagline: "Stop Burning Ad Spend. Scale With Data.",
      features: [
        "Meta Ads & Google Ads end-to-end management",
        "High-converting landing page optimization",
        "Audience segmentation & retargeting",
        "Real-time ROI dashboard & analytics"
      ]
    },
    {
      id: 'social-media-management',
      icon: <Share2 size={36} color="#a855f7" />,
      accentColor: '#a855f7',
      title: "Social Media Management",
      shortDesc: "Struggling to keep up with your social presence? We curate, strategize, and grow vibrant brand communities.",
      tagline: "Build Community, Not Just Followers.",
      features: [
        "30-day custom content calendar",
        "High-engagement carousels & graphic designs",
        "Active DM & comment interaction",
        "Organic viral growth strategy"
      ]
    },
    {
      id: 'content-creation',
      icon: <Video size={36} color="#f43f5e" />,
      accentColor: '#f43f5e',
      title: "Content Creation",
      shortDesc: "High-impact cinematic visuals, reels, and production that elevate your brand narrative from zero to hero.",
      tagline: "Cinematic Visuals Engineered for Attention.",
      features: [
        "Scriptwriting & storyboard crafting",
        "4K shoot and photography sessions",
        "Fast-paced dynamic reel editing & sound design",
        "Batch production sessions"
      ]
    },
    {
      id: 'website-development',
      icon: <Globe size={36} color="#10b981" />,
      accentColor: '#10b981',
      title: "Website Development",
      shortDesc: "Comprehensive web engineering crafted to bring your online vision to life with fluid speed and responsiveness.",
      tagline: "Blazing Fast Web Experiences That Convert.",
      features: [
        "Custom responsive web development (React/Next)",
        "Mobile-first design with instant load times",
        "Integrated lead forms & WhatsApp triggers",
        "Technical SEO optimization"
      ]
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070a12', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Background Lighting */}
      <div style={{
        position: 'fixed', top: '-150px', left: '10%', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none', filter: 'blur(50px)'
      }} />

      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(7, 10, 18, 0.85)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }} 
          onClick={handleLogoClick}
          title="Zing Digital Media"
        >
          <div style={{ background: 'linear-gradient(135deg, #38bdf8, #a855f7)', width: '34px', height: '34px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            Z
          </div>
          <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px' }}>ZING DIGITAL MEDIA</span>
        </div>

        <div>
          {currentView === 'admin' ? (
            <button 
              onClick={() => setCurrentView('home')}
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#94a3b8', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
            >
              ← Back to Website
            </button>
          ) : (
            <button 
              onClick={() => setShowModal(true)}
              style={{ background: 'linear-gradient(135deg, #0284c7, #2563eb)', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.35)' }}
            >
              Book Consultation
            </button>
          )}
        </div>
      </nav>

      {/* ===================== VIEW 1: HOMEPAGE ===================== */}
      {currentView === 'home' && (
        <main style={{ position: 'relative', zIndex: 1 }}>
          <section style={{ padding: '90px 24px 70px', textAlign: 'center', maxWidth: '880px', margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '30px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.25)', color: '#38bdf8', fontSize: '13px', marginBottom: '24px' }}>
              <Sparkles size={14} /> DON'T CHASE TRENDS. SET THEM.
            </div>
            <h1 style={{ fontSize: 'clamp(34px, 5.5vw, 60px)', fontWeight: '900', lineHeight: '1.15', margin: '0 0 20px' }}>
              We develop <span style={{ background: 'linear-gradient(to right, #38bdf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>bold, powerful</span>, and unforgettable brands.
            </h1>
            <p style={{ fontSize: '17px', color: '#94a3b8', maxWidth: '620px', margin: '0 auto 32px', lineHeight: '1.6' }}>
              Full-funnel digital marketing tailored for high growth — from web design and content creation to data-driven performance ads.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setShowModal(true)}
                style={{ background: 'linear-gradient(135deg, #0284c7, #2563eb)', color: '#fff', border: 'none', padding: '14px 26px', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Schedule Appointment <ChevronRight size={18} />
              </button>
              <a 
                href="tel:9769397185"
                style={{ textDecoration: 'none', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.15)', padding: '14px 22px', borderRadius: '10px', fontSize: '15px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)' }}
              >
                <Phone size={18} color="#38bdf8" /> Call 9769397185
              </a>
            </div>
          </section>

          {/* Services list */}
          <section style={{ padding: '60px 24px', maxWidth: '1150px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: '30px', fontWeight: '800', margin: '0 0 10px' }}>Our Services</h2>
              <p style={{ color: '#94a3b8', fontSize: '15px' }}>Engineered to elevate modern brands across every digital touchpoint</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              {servicesData.map((svc) => (
                <div 
                  key={svc.id}
                  style={{ backgroundColor: 'rgba(30, 41, 59, 0.45)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '28px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                  <div>
                    <div style={{ marginBottom: '16px' }}>{svc.icon}</div>
                    <h3 style={{ fontSize: '19px', fontWeight: '700', margin: '0 0 10px' }}>{svc.title}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.6', margin: 0 }}>{svc.shortDesc}</p>
                  </div>
                  <button 
                    onClick={() => { setSelectedService(svc); setCurrentView('service-detail'); }}
                    style={{ marginTop: '22px', background: 'transparent', border: 'none', color: svc.accentColor, fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: 0 }}
                  >
                    KNOW MORE <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* ===================== VIEW 2: SERVICE DETAIL ===================== */}
      {currentView === 'service-detail' && selectedService && (
        <section style={{ maxWidth: '900px', margin: '40px auto 80px', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <button 
            onClick={() => setCurrentView('home')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', marginBottom: '32px', fontSize: '14px' }}
          >
            <ArrowLeft size={16} /> Back to Services
          </button>

          <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: `1px solid ${selectedService.accentColor}44`, borderRadius: '20px', padding: '40px', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 10px' }}>{selectedService.title}</h1>
            <p style={{ fontSize: '18px', color: '#f1f5f9', fontWeight: '600', margin: '0 0 12px' }}>"{selectedService.tagline}"</p>
            <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>{selectedService.shortDesc}</p>
          </div>

          <div style={{ background: '#161f30', border: '1px solid #334155', borderRadius: '16px', padding: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={20} color={selectedService.accentColor} /> Key Capabilities
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {selectedService.features.map((feat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(15,23,42,0.6)', padding: '14px', borderRadius: '8px' }}>
                  <CheckCircle size={18} color={selectedService.accentColor} />
                  <span style={{ fontSize: '14px', color: '#cbd5e1' }}>{feat}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => { setFormData({ ...formData, service: selectedService.title }); setShowModal(true); }}
              style={{ marginTop: '28px', background: '#2563eb', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Inquire For This Service
            </button>
          </div>
        </section>
      )}

      {/* ===================== VIEW 3: ADMIN DASHBOARD (TOTAL INQUIRY & TOTAL REACHED) ===================== */}
      {currentView === 'admin' && (
        <section style={{ maxWidth: '1050px', margin: '40px auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          {!isLoggedIn ? (
            <div style={{ maxWidth: '360px', margin: '60px auto', background: '#161f30', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '32px' }}>
              <div style={{ textAlign: 'center', marginBottom: '22px' }}>
                <Shield size={32} color="#38bdf8" style={{ marginBottom: '8px' }} />
                <h2 style={{ fontSize: '20px', margin: '0 0 6px' }}>Private Admin Login</h2>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Authorized administrators only</p>
              </div>

              {loginError && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#f87171', padding: '8px', borderRadius: '6px', fontSize: '12px', marginBottom: '14px', textAlign: 'center' }}>
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input 
                  type="text" 
                  placeholder="admin" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                  style={{ background: '#0b0f19', border: '1px solid #334155', padding: '10px 12px', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
                <input 
                  type="password" 
                  placeholder="agency123" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  style={{ background: '#0b0f19', border: '1px solid #334155', padding: '10px 12px', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
                <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '11px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Unlock Dashboard
                </button>
              </form>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '16px', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Lead Management CRM</h1>
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>Client Inquiries & Call Status</span>
                </div>
                <button 
                  onClick={handleLogout}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>

              {/* Counters: Total Inquiries & Total Reached */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '28px' }}>
                
                {/* Total Inquiries Card */}
                <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ color: '#94a3b8', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} color="#38bdf8" /> Total Inquiries
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px', color: '#38bdf8' }}>
                    {totalInquiries}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Total client forms received</div>
                </div>

                {/* Total Reached (Call Done) Card */}
                <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ color: '#94a3b8', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PhoneCall size={18} color="#10b981" /> Total Reached
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px', color: '#10b981' }}>
                    {totalReached}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Clients contacted via phone/call</div>
                </div>

                {/* Pending Card */}
                <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ color: '#94a3b8', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={18} color="#f59e0b" /> Pending Follow-up
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px', color: '#f59e0b' }}>
                    {totalInquiries - totalReached}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Awaiting call</div>
                </div>

              </div>

              {/* Inquiries Table: Name, Phone, Email, Service, Status */}
              <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', fontWeight: 'bold', fontSize: '15px' }}>
                  Client Inquiries List
                </div>

                {loadingLeads ? (
                  <div style={{ padding: '28px', textAlign: 'center', color: '#94a3b8' }}>Loading leads data...</div>
                ) : leads.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No inquiries captured yet. Try submitting a test lead from the website!</div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                      <thead>
                        <tr style={{ background: '#0f172a', color: '#94a3b8' }}>
                          <th style={{ padding: '14px 16px' }}>Name</th>
                          <th style={{ padding: '14px 16px' }}>Phone Number</th>
                          <th style={{ padding: '14px 16px' }}>Email</th>
                          <th style={{ padding: '14px 16px' }}>Service Inquired</th>
                          <th style={{ padding: '14px 16px' }}>Status</th>
                          <th style={{ padding: '14px 16px' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map((l, i) => (
                          <tr key={l.id || l._id || i} style={{ borderTop: '1px solid #334155' }}>
                            <td style={{ padding: '14px 16px', fontWeight: '600' }}>{l.name}</td>
                            <td style={{ padding: '14px 16px' }}>
                              <a href={`tel:${l.phone}`} style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '500' }}>
                                {l.phone || '—'}
                              </a>
                            </td>
                            <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{l.email}</td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '4px 10px', borderRadius: '6px', fontSize: '12px' }}>
                                {l.service}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{
                                padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600',
                                background: l.status === 'Reached' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                color: l.status === 'Reached' ? '#34d399' : '#fbbf24'
                              }}>
                                {l.status === 'Reached' ? '✓ Reached (Called)' : '⏱ Pending Call'}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <button 
                                onClick={() => toggleStatus(l.id || l._id)}
                                style={{
                                  background: l.status === 'Reached' ? '#334155' : '#10b981',
                                  color: '#fff', border: 'none', padding: '6px 12px',
                                  borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '600'
                                }}
                              >
                                {l.status === 'Reached' ? 'Mark Pending' : 'Mark Called'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ===================== CONSULTATION MODAL (WITH PHONE NUMBER) ===================== */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#161f30', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', maxWidth: '420px', width: '100%', padding: '24px', position: 'relative' }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            {formSent ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle size={44} color="#10b981" style={{ margin: '0 auto 10px' }} />
                <h3 style={{ margin: 0, fontSize: '18px' }}>Inquiry Sent!</h3>
                <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '6px' }}>Details saved to agency portal.</p>
              </div>
            ) : (
              <div>
                <h3 style={{ margin: '0 0 6px', fontSize: '19px' }}>Book Consultation</h3>
                <p style={{ margin: '0 0 16px', color: '#94a3b8', fontSize: '13px' }}>Leave your contact details and goals.</p>

                <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: '100%', background: '#0b0f19', border: '1px solid #334155', borderRadius: '8px', padding: '9px 12px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: '100%', background: '#0b0f19', border: '1px solid #334155', borderRadius: '8px', padding: '9px 12px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: '100%', background: '#0b0f19', border: '1px solid #334155', borderRadius: '8px', padding: '9px 12px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Service Needed</label>
                    <select 
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      style={{ width: '100%', background: '#0b0f19', border: '1px solid #334155', borderRadius: '8px', padding: '9px 12px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                    >
                      <option>Performance Marketing</option>
                      <option>Social Media Management</option>
                      <option>Content Creation</option>
                      <option>Website Development</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Message (Optional)</label>
                    <textarea 
                      rows={2}
                      placeholder="Project details or brand goals..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{ width: '100%', background: '#0b0f19', border: '1px solid #334155', borderRadius: '8px', padding: '9px 12px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <button 
                    type="submit" 
                    style={{ background: 'linear-gradient(135deg, #0284c7, #2563eb)', color: '#fff', border: 'none', padding: '11px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '4px' }}
                  >
                    Submit Inquiry
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '36px 24px', maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', fontSize: '13px', color: '#64748b' }}>
        <div>© 2026 Zing Digital Media. All rights reserved.</div>
        <div>Direct: +91 9769397185 | business@zingdigitalmedia.in</div>
      </footer>

    </div>
  );
}
