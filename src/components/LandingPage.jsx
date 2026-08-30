import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Stethoscope,
  ShieldCheck,
  Clock,
  Heart,
  UserCheck,
  HeartPulse,
  Activity,
  Bone,
  Baby,
  Brain,
  Smile,
  Phone,
  Mail,
  MapPin,
  Send,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Shield,
  Users,
  Lock,
  Sparkles
} from 'lucide-react';

export const LandingPage = ({ onLaunchDemo }) => {
  const { setActiveRole, createSosEmergency } = useApp();
  
  // Contact & SOS Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [subject, setSubject] = useState('Accident');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitSosMessage = (e) => {
    e.preventDefault();
    createSosEmergency({
      patientName: fullName || 'Citizen Patient',
      phone: phoneNumber || '123-456-7890',
      age: 42,
      emergencyType: subject,
      pickupLocation: {
        lat: 40.715000,
        lng: -73.955000,
        address: message || '123 Wellness Blvd, Health City'
      }
    });
    setIsSubmitted(true);
  };

  const handleOpenApp = (roleId = 'callcentre') => {
    setActiveRole(roleId);
    if (onLaunchDemo) onLaunchDemo();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-emerald-600 selection:text-white">
      
      {/* TOP FEATURE RIBBON BAR */}
      <div className="bg-[#f0fdf4] py-4 px-4 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto bg-[#064e3b] text-white rounded-2xl p-4 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="flex items-center space-x-3 bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/50">
            <div className="p-2.5 bg-emerald-600 rounded-lg">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-white">Expert Doctors</h4>
              <p className="text-[11px] text-emerald-200">Highly qualified & experienced healthcare professionals.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/50">
            <div className="p-2.5 bg-emerald-600 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-white">Advanced Care</h4>
              <p className="text-[11px] text-emerald-200">Modern technology for accurate diagnosis and treatment.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/50">
            <div className="p-2.5 bg-emerald-600 rounded-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-white">Quick Appointments</h4>
              <p className="text-[11px] text-emerald-200">Easy scheduling with minimal waiting time.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/50">
            <div className="p-2.5 bg-emerald-600 rounded-lg">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-white">Personalized Care</h4>
              <p className="text-[11px] text-emerald-200">Treatment plans tailored to your unique health needs.</p>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 1: OUR SERVICES GRID */}
      <section className="py-16 px-6 max-w-7xl mx-auto space-y-10">
        
        {/* Header Tag & Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center space-x-1.5 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold px-3.5 py-1 rounded-full">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Our Services</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
            Comprehensive Care, <span className="text-emerald-700">Tailored for You</span>
          </h2>
          <p className="text-slate-600 text-sm font-medium">
            We offer a wide range of healthcare services designed to meet your needs with compassion and excellence.
          </p>
        </div>

        {/* Services Grid (1 Featured Dark Card + 7 Clean Service Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Featured Card */}
          <div className="bg-[#064e3b] text-white p-6 rounded-3xl shadow-xl space-y-4 flex flex-col justify-between border border-emerald-700 relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-600/20 rounded-full blur-xl group-hover:scale-150 transition-transform" />
            <div className="space-y-3 relative z-10">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <HeartPulse className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-serif leading-snug">
                Expert Care. Tailored Every Step of the Way.
              </h3>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Our team is dedicated to providing high-quality, personalized healthcare for you and your family.
              </p>
            </div>

            <button
              onClick={() => handleOpenApp('callcentre')}
              className="mt-4 inline-flex items-center space-x-2 bg-white hover:bg-emerald-50 text-[#064e3b] font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow self-start"
            >
              <span>View All Services</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Service Card 1: General Consultation */}
          <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-slate-200 space-y-3 flex flex-col justify-between transition-all group">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <Stethoscope className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 font-serif">General Consultation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Comprehensive checkups and personalized healthcare for your overall well-being.
              </p>
            </div>
            <button onClick={() => handleOpenApp('sos')} className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Service Card 2: Cardiology Care */}
          <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-slate-200 space-y-3 flex flex-col justify-between transition-all group">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <Heart className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 font-serif">Cardiology Care</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Advanced heart care and treatment to keep your heart healthy and strong.
              </p>
            </div>
            <button onClick={() => handleOpenApp('sos')} className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Service Card 3: Diagnostic Services */}
          <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-slate-200 space-y-3 flex flex-col justify-between transition-all group">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <Activity className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 font-serif">Diagnostic Services</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Accurate testing and imaging services for precise diagnosis and effective treatment.
              </p>
            </div>
            <button onClick={() => handleOpenApp('callcentre')} className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Service Card 4: Orthopedic Care */}
          <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-slate-200 space-y-3 flex flex-col justify-between transition-all group">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <Bone className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 font-serif">Orthopedic Care</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Expert care for bones, joints, and muscles to help you move better and live pain-free.
              </p>
            </div>
            <button onClick={() => handleOpenApp('hospital')} className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Service Card 5: Pediatric Care */}
          <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-slate-200 space-y-3 flex flex-col justify-between transition-all group">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <Baby className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 font-serif">Pediatric Care</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Specialized healthcare for infants, children, and adolescents with gentle attention.
              </p>
            </div>
            <button onClick={() => handleOpenApp('hospital')} className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Service Card 6: Neurology Care */}
          <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-slate-200 space-y-3 flex flex-col justify-between transition-all group">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <Brain className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 font-serif">Neurology Care</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Diagnosis and treatment for nerve, brain, and spine conditions.
              </p>
            </div>
            <button onClick={() => handleOpenApp('hospital')} className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Service Card 7: Mental Wellness */}
          <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-slate-200 space-y-3 flex flex-col justify-between transition-all group">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <Smile className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 font-serif">Mental Wellness</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compassionate support for mental health and emotional well-being.
              </p>
            </div>
            <button onClick={() => handleOpenApp('callcentre')} className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>

      </section>

      {/* SECTION 2: CONTACT US & EMERGENCY SOS INTAKE */}
      <section className="py-16 px-6 bg-[#f0fdf4] border-t border-b border-emerald-100">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center space-x-1.5 bg-emerald-200/80 border border-emerald-400 text-emerald-900 text-xs font-bold px-3.5 py-1 rounded-full">
              <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
              <span>Get in Touch</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
              Contact <span className="text-emerald-700">Us</span>
            </h2>
            <p className="text-slate-600 text-sm font-medium">
              We're here to help! Reach out to us for appointments, emergency SOS intake, or any assistance you need.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Column 1: Get in Touch Info Card (3 cols) */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 font-serif border-b border-slate-100 pb-2">
                Get in Touch
              </h3>
              <p className="text-xs text-slate-600">Choose the best way to reach out to us.</p>

              <div className="space-y-4 text-xs">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Call Us</h5>
                    <p className="text-slate-600">123-456-7890</p>
                    <p className="text-[10px] text-slate-400">Mon - Sat: 8:00 AM - 8:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Email Us</h5>
                    <p className="text-slate-600">info@wellcare.com</p>
                    <p className="text-[10px] text-slate-400">We'll reply within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Visit Us</h5>
                    <p className="text-slate-600">123 Wellness Blvd, Health City, HC 12345, USA</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Working Hours</h5>
                    <p className="text-slate-600">Mon - Sat: 8:00 AM - 8:00 PM</p>
                    <p className="text-slate-600">Sunday: 9:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Send Us a Message / Emergency SOS Form (5 cols) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 font-serif border-b border-slate-100 pb-2">
                Send Us a Message / Emergency SOS Intake
              </h3>

              {isSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto animate-pulse" />
                  <h4 className="font-bold text-emerald-900 text-sm">Message & Emergency SOS Submitted!</h4>
                  <p className="text-xs text-emerald-800">
                    Our medical call centre operator has received your request and dispatched an ambulance unit.
                  </p>
                  <button
                    onClick={() => handleOpenApp('callcentre')}
                    className="py-2 px-4 bg-[#064e3b] text-white rounded-xl text-xs font-bold shadow"
                  >
                    View Call Centre Dashboard
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitSosMessage} className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                      <input
                        type="text"
                        placeholder="Enter your phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-600"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Subject / Emergency Type</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                    >
                      <option value="Accident">Accident Trauma Emergency</option>
                      <option value="Heart issue">Heart Issue / Cardiac Emergency</option>
                      <option value="Breathing issue">Breathing Issue / Respiratory Distress</option>
                      <option value="General Inquiry">General Healthcare Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Message / Pickup Address</label>
                    <textarea
                      rows={3}
                      placeholder="Type your message or pickup address here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#064e3b] hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Message / Trigger SOS</span>
                  </button>
                </form>
              )}
            </div>

            {/* Column 3: Visit Our Clinic (3 cols) */}
            <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 font-serif border-b border-slate-100 pb-2">
                  Visit Our Clinic
                </h3>
                <div className="rounded-2xl overflow-hidden border border-slate-200 h-36 relative">
                  <img
                    src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80"
                    alt="WellCare Medical Center"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-[#064e3b] text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">
                    WellCare Medical Center
                  </div>
                </div>
                <p className="text-xs text-slate-600">
                  We're conveniently located and always happy to welcome you.
                </p>
              </div>

              <button
                onClick={() => handleOpenApp('corridor')}
                className="w-full py-2.5 border border-emerald-600 text-emerald-800 hover:bg-emerald-50 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
              >
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span>Get Directions (Green Corridor)</span>
              </button>
            </div>

          </div>

          {/* Bottom 4 Feature Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-emerald-200/80">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 bg-white p-3 rounded-xl border border-emerald-200 shadow-sm">
              <Shield className="h-4 w-4 text-emerald-600 shrink-0" />
              <div>
                <p className="font-extrabold text-slate-900">24/7 Support</p>
                <p className="text-[10px] text-slate-500">We're here anytime</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 bg-white p-3 rounded-xl border border-emerald-200 shadow-sm">
              <Users className="h-4 w-4 text-emerald-600 shrink-0" />
              <div>
                <p className="font-extrabold text-slate-900">Friendly Team</p>
                <p className="text-[10px] text-slate-500">Ready to assist you</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 bg-white p-3 rounded-xl border border-emerald-200 shadow-sm">
              <Lock className="h-4 w-4 text-emerald-600 shrink-0" />
              <div>
                <p className="font-extrabold text-slate-900">Data Protection</p>
                <p className="text-[10px] text-slate-500">Your privacy is priority</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 bg-white p-3 rounded-xl border border-emerald-200 shadow-sm">
              <Heart className="h-4 w-4 text-emerald-600 shrink-0" />
              <div>
                <p className="font-extrabold text-slate-900">Compassionate Care</p>
                <p className="text-[10px] text-slate-500">Respect & kindness</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: BANNER CTA WITH DOCTOR PHOTO */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="bg-[#f0fdf4] border border-emerald-200 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6 relative z-10">
            <span className="inline-flex items-center space-x-1.5 bg-emerald-200/80 border border-emerald-400 text-emerald-900 text-xs font-bold px-3.5 py-1 rounded-full">
              <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
              <span>Your Health, Our Priority</span>
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-serif leading-tight">
              Ready to Take the Next Step Toward <span className="text-emerald-700">Better Health?</span>
            </h2>

            <p className="text-slate-600 text-sm font-medium leading-relaxed max-w-xl">
              Our caring team is here to support you at every stage of your health journey. Book an emergency appointment today and experience the WellCare difference.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => handleOpenApp('callcentre')}
                className="bg-[#064e3b] hover:bg-emerald-900 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-md flex items-center space-x-2 transition-all"
              >
                <Calendar className="h-4 w-4" />
                <span>Book an Appointment</span>
              </button>

              <a
                href="tel:1234567890"
                className="bg-white border border-emerald-600 hover:bg-emerald-50 text-emerald-900 font-bold text-xs px-6 py-3.5 rounded-xl shadow-sm flex items-center space-x-2 transition-all"
              >
                <Phone className="h-4 w-4 text-emerald-700" />
                <span>Call Us Now: (123) 456-7890</span>
              </a>
            </div>
          </div>

          {/* Right Column: Doctor & Patient Photo */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden border-4 border-white shadow-xl max-h-[380px] relative">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
                alt="Caring Doctor and Patient"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 right-4 bg-[#064e3b] text-white px-4 py-2 rounded-2xl shadow-lg flex items-center space-x-2 border border-emerald-500">
                <UserCheck className="h-5 w-5 text-emerald-300" />
                <div>
                  <p className="text-xs font-extrabold">15,000+</p>
                  <p className="text-[10px] text-emerald-200">Happy Patients</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#064e3b] text-emerald-100 py-12 px-6 border-t border-emerald-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <HeartPulse className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-lg text-white font-serif tracking-tight">WellCare</span>
            </div>
            <p className="text-emerald-200 leading-relaxed">
              Medical Center & LifeRoute Emergency Response Network. Providing compassionate, high-quality healthcare services.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Quick Links</h5>
            <ul className="space-y-1 text-emerald-200 font-medium">
              <li><button onClick={() => handleOpenApp('sos')} className="hover:text-white">Patient SOS</button></li>
              <li><button onClick={() => handleOpenApp('callcentre')} className="hover:text-white">Call Centre Operator</button></li>
              <li><button onClick={() => handleOpenApp('ambulance')} className="hover:text-white">Ambulance Crew</button></li>
              <li><button onClick={() => handleOpenApp('hospital')} className="hover:text-white">Hospital Desk</button></li>
            </ul>
          </div>

          {/* Our Services */}
          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Our Services</h5>
            <ul className="space-y-1 text-emerald-200 font-medium">
              <li>Cardiology Care</li>
              <li>Emergency Trauma Intakes</li>
              <li>Diagnostic & Imaging</li>
              <li>Green Corridor Traffic Dispatch</li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Contact Us</h5>
            <p className="text-emerald-200">123 Wellness Blvd, Health City, USA</p>
            <p className="text-emerald-200">Emergency Phone: 123-456-7890 / 108</p>
            <p className="text-emerald-200">Email: info@wellcare.com</p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-emerald-800/80 mt-8 pt-6 text-center text-emerald-300 text-[11px]">
          © 2026 WellCare Medical Center & LifeRoute Emergency Platform. All rights reserved.
        </div>
      </footer>

    </div>
  );
};
