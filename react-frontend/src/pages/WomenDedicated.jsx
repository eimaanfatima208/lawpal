import React, { useState, useEffect } from "react";
import {
  Users,
  Shield,
  Heart,
  Briefcase,
  Award,
  Phone,
} from "lucide-react";
import "./WomenDedicated.css";

const API_BASE = "/api";

export default function WomenDedicated({ onOpenChat, onBookAppointment }) {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWomenLawyers();
  }, []);

  const fetchWomenLawyers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/lawyers/women`);
      const data = await res.json();
      if (data.success && Array.isArray(data.lawyers)) {
        setLawyers(data.lawyers);
      }
    } catch (err) {
      console.error("Failed to fetch women lawyers:", err);
    } finally {
      setLoading(false);
    }
  };

  const services = [
    {
      icon: Shield,
      title: "Family Law Protection",
      description: "Expert legal support for divorce, custody, and domestic violence cases",
    },
    {
      icon: Heart,
      title: "Women's Rights Advocacy",
      description: "Dedicated representation for workplace discrimination and harassment",
    },
    {
      icon: Briefcase,
      title: "Career Legal Support",
      description: "Employment law services tailored for professional women",
    },
    {
      icon: Award,
      title: "Empowerment Programs",
      description: "Free legal workshops and consultation sessions for women",
    },
  ];

  const handleBookConsultation = (lawyer) => {
    if (onBookAppointment) {
      onBookAppointment(lawyer);
    }
  };

  return (
    <div className="women-dedicated-container">
      {/* Header Section */}
      <div className="women-header">
        <h1 className="women-title">
          Women's Legal Support Center
        </h1>
        <p className="women-subtitle">
          Empowering women through expert legal guidance and dedicated representation
        </p>
      </div>

      {/* Hero Section */}
      <div className="women-hero">
        <div className="hero-content">
          <div className="hero-icon-wrapper">
            <Users className="hero-icon" />
          </div>
          <div className="hero-text">
            <h2 className="hero-title">Your Rights, Your Voice, Your Justice</h2>
            <p className="hero-description">We stand with you every step of the way</p>
          </div>
        </div>
        <p className="hero-body">
          At LawPal, we understand the unique legal challenges women face. Our dedicated team of 
          experienced female lawyers provides compassionate, confidential, and comprehensive legal 
          services tailored to your needs. From family law to employment rights, we're here to 
          protect and empower you.
        </p>
      </div>

      {/* Services Section */}
      <div className="women-section">
        <h2 className="section-title">Our Specialized Services</h2>
        <div className="services-grid">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="service-card">
                <div className="service-icon-wrapper">
                  <IconComponent className="service-icon" />
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Lawyers Section */}
      <div className="women-section">
        <h2 className="section-title">Our Expert Women Lawyers</h2>
        {loading ? (
          <div className="loading-message">Loading lawyers...</div>
        ) : lawyers.length === 0 ? (
          <div className="no-lawyers-message">
            No women lawyers available at the moment. Please check back later.
          </div>
        ) : (
          <div className="lawyers-grid">
            {lawyers.map((lawyer, index) => {
              const getInitials = (name) => {
                const names = name.trim().split(" ");
                if (names.length >= 2) {
                  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
                }
                return name.substring(0, 2).toUpperCase();
              };

              return (
                <div key={lawyer.id || index} className="lawyer-card">
                  <div className="lawyer-header">
                    <div className="lawyer-avatar">
                      {getInitials(lawyer.full_name)}
                    </div>
                    <div className="lawyer-info">
                      <h3 className="lawyer-name">{lawyer.full_name}</h3>
                      <p className="lawyer-specialization">
                        {lawyer.specialty || lawyer.specialization || "Family Law & Women's Rights"}
                      </p>
                    </div>
                  </div>
                  <div className="lawyer-details">
                    {lawyer.education && (
                      <p className="lawyer-detail">
                        <span className="detail-label">Education:</span> {lawyer.education}
                      </p>
                    )}
                    {lawyer.serial_no_hc && (
                      <p className="lawyer-detail">
                        <span className="detail-label">HC Serial:</span> {lawyer.serial_no_hc}
                      </p>
                    )}
                    <p className="lawyer-detail">
                      <span className="detail-label">City:</span> {lawyer.city || 'Lahore'}
                    </p>
                    <p className="lawyer-detail">
                      <span className="detail-label">Experience:</span> {lawyer.experience || 'Advocate High Court'}
                    </p>
                  </div>
                  <p className="lawyer-description">
                    {lawyer.description || "Specialized in protecting women's rights in family matters"}
                  </p>
                  <button
                    onClick={() => handleBookConsultation(lawyer)}
                    className="book-consultation-btn"
                  >
                    Book Consultation
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Support Section */}
      <div className="support-section">
        <div className="support-header">
          <div className="support-icon-wrapper">
            <Phone className="support-icon" />
          </div>
          <div className="support-text">
            <h3 className="support-title">Emergency Helplines</h3>
            <p className="support-description">
              Immediate assistance available 24/7. All services are free and confidential.
            </p>
          </div>
        </div>

        {/* Women's Dedicated Helplines */}
        <div className="helplines-section">
          <h4 className="helplines-title">Women's Dedicated Helplines</h4>
          <div className="helplines-grid">
            <div className="helpline-card featured">
              <div className="helpline-header">
                <Heart className="helpline-icon" />
                <h4 className="helpline-name">Punjab Women's Helpline</h4>
              </div>
              <span className="helpline-number">1043</span>
              <p className="helpline-type">24/7 Toll-Free (PCSW)</p>
              <p className="helpline-desc">
                Gender-based harassment, workplace issues, domestic violence, legal advice
              </p>
            </div>

            <div className="helpline-card featured">
              <div className="helpline-header">
                <Shield className="helpline-icon" />
                <h4 className="helpline-name">Punjab Women Protection</h4>
              </div>
              <span className="helpline-number">1737</span>
              <p className="helpline-type">PWPA Helpline</p>
              <p className="helpline-desc">
                Violence, abuse, protection services across Punjab
              </p>
            </div>

            <div className="helpline-card featured">
              <div className="helpline-header">
                <Heart className="helpline-icon" />
                <h4 className="helpline-name">Madadgaar National</h4>
              </div>
              <span className="helpline-number">1098</span>
              <p className="helpline-type">National Hotline</p>
              <p className="helpline-desc">
                Violence, abuse, exploitation, legal support & referrals
              </p>
            </div>

            <div className="helpline-card featured">
              <div className="helpline-header">
                <Shield className="helpline-icon" />
                <h4 className="helpline-name">Human Rights Helpline</h4>
              </div>
              <span className="helpline-number">1099</span>
              <p className="helpline-type">Federal Helpline</p>
              <p className="helpline-desc">
                Women & children protection, legal advice, human rights
              </p>
            </div>

            <div className="helpline-card featured">
              <div className="helpline-header">
                <Shield className="helpline-icon" />
                <h4 className="helpline-name">Cyber Harassment</h4>
              </div>
              <span className="helpline-number">0800-39393</span>
              <p className="helpline-type">Online Safety</p>
              <p className="helpline-desc">
                Digital security, online harassment support
              </p>
            </div>

            <div className="helpline-card featured">
              <div className="helpline-header">
                <Briefcase className="helpline-icon" />
                <h4 className="helpline-name">LawPal Legal Support</h4>
              </div>
              <span className="helpline-number">+92 300 1234567</span>
              <p className="helpline-type">Free Consultation</p>
              <p className="helpline-desc">
                Expert legal advice and representation
              </p>
            </div>
          </div>
        </div>

        {/* General Emergency Services */}
        <div className="emergency-section">
          <h4 className="helplines-title">General Emergency Services</h4>
          <div className="emergency-grid">
            <div className="emergency-card">
              <div className="emergency-header">
                <Shield className="emergency-icon" />
                <h4 className="emergency-name">Police Emergency</h4>
              </div>
              <span className="emergency-number">15</span>
              <p className="emergency-type">Law Enforcement</p>
            </div>

            <div className="emergency-card">
              <div className="emergency-header">
                <Phone className="emergency-icon" />
                <h4 className="emergency-name">Ambulance</h4>
              </div>
              <span className="emergency-number">115</span>
              <p className="emergency-type">Medical Emergency</p>
            </div>

            <div className="emergency-card">
              <div className="emergency-header">
                <Shield className="emergency-icon" />
                <h4 className="emergency-name">Fire Brigade</h4>
              </div>
              <span className="emergency-number">16</span>
              <p className="emergency-type">Fire Emergency</p>
            </div>

            <div className="emergency-card">
              <div className="emergency-header">
                <Heart className="emergency-icon" />
                <h4 className="emergency-name">Child Protection</h4>
              </div>
              <span className="emergency-number">1121</span>
              <p className="emergency-type">Child Safety & Welfare</p>
            </div>

            <div className="emergency-card">
              <div className="emergency-header">
                <Phone className="emergency-icon" />
                <h4 className="emergency-name">Rescue 1122</h4>
              </div>
              <span className="emergency-number">1122</span>
              <p className="emergency-type">Emergency Rescue</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

