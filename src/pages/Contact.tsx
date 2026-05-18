import { motion } from 'motion/react';
import { Phone, MapPin, Mail, MessageCircle, Send, ArrowRight, Leaf, Loader2 } from 'lucide-react';
import { CONTACT_PHONE, CONTACT_EMAIL, LOCATION } from '../constants';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { submitInquiry } from '../lib/api';
import SEO from '../components/SEO';

export default function Contact() {
  const location = useLocation();
  const [selectedInterest, setSelectedInterest] = useState('General Inquiry');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    if (location.state?.interest) {
      setSelectedInterest(location.state.interest);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await submitInquiry({
        ...formData,
        interest: selectedInterest,
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="premium-card p-12 text-center space-y-6 max-w-lg"
        >
          <Leaf className="text-secondary h-16 w-16 mx-auto" />
          <h2 className="text-3xl font-serif font-bold text-primary">Inquiry Received.</h2>
          <p className="text-primary/60 font-light">Thank you for your interest. Our expertise team will contact you shortly.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="btn-premium"
          >
            Submit Another
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <SEO
        title="Contact Us - Get in Touch"
        description="Contact Kaliyapa Farmstead for livestock inquiries, partnerships, or farm visits. Located in Lifidzi, Salima, Malawi. Phone: +265 993 02 70 68."
        keywords="contact Kaliyapa Farmstead, livestock inquiries, farm visit Salima, goat farming contact, Malawi agriculture"
        canonicalUrl="https://kaliyapafarmstead.com/contact"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact Kaliyapa Farmstead",
          "url": "https://kaliyapafarmstead.com/contact",
          "mainEntity": {
            "@type": "Organization",
            "name": "Kaliyapa Farmstead",
            "telephone": "+265-993-02-70-68",
            "email": "lysonkaliyapa@gmail.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Lifidzi, 15km from Kamuzu Road",
              "addressLocality": "Salima",
              "addressRegion": "Central Region",
              "addressCountry": "MW"
            }
          }
        }}
      />
      {/* Header */}
      <section className="pt-32 md:pt-40 lg:pt-48 pb-16 md:pb-32 px-4 bg-primary text-white overflow-hidden relative text-center">
        <div className="grain-overlay opacity-10" />
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-badge mb-8 md:mb-12"
          >
            <MessageCircle className="h-3 w-3" /> Direct Channel
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold leading-[0.9] tracking-tighter mb-8 md:mb-12"
          >
            Establish <br/> <span className="italic text-secondary">Contact.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base md:text-lg text-white/50 font-light italic font-serif max-w-2xl mx-auto"
          >
            Whether you're a partner, distributor, or curious visitor — we welcome every conversation.
          </motion.p>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-stretch">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12 md:space-y-16 py-8 md:py-12"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6 md:mb-8">Reach our Head Office.</h2>
                <div className="space-y-6 md:space-y-8">
                  {[
                    { icon: Phone, label: "Telecommunication", value: CONTACT_PHONE },
                    { icon: Mail, label: "Digital Correspondence", value: CONTACT_EMAIL },
                    { icon: MapPin, label: "Geographic Coordinates", value: LOCATION }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 md:gap-8 group">
                      <div className="p-4 md:p-5 bg-primary/5 rounded-[1rem] md:rounded-[1.5rem] group-hover:bg-primary group-hover:text-white transition-all duration-500 shrink-0">
                        <item.icon size={24} />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold tracking-widest uppercase text-primary/40 mb-2">{item.label}</div>
                        <div className="text-base md:text-xl font-serif text-primary font-bold">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Channels Alternative Design */}
              <div className="p-8 md:p-12 premium-card bg-secondary/10 border-none">
                <h4 className="text-lg md:text-xl font-serif font-bold text-primary mb-4 md:mb-6">Real-time Updates</h4>
                <div className="flex gap-4">
                  <a href="#" className="p-3 md:p-4 bg-white rounded-full text-primary hover:bg-primary hover:text-white transition-all shadow-sm"><MessageCircle size={24} /></a>
                  <a href="#" className="p-3 md:p-4 bg-white rounded-full text-primary hover:bg-primary hover:text-white transition-all shadow-sm"><ArrowRight size={24} /></a>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="premium-card p-6 md:p-10 lg:p-16 shadow-2xl shadow-primary/5"
            >
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/40 block ml-3 md:ml-4">Legal Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. John Doe"
                      className="w-full bg-cream/50 border border-transparent focus:border-secondary transition-all rounded-[1rem] md:rounded-[1.5rem] px-6 md:px-8 py-4 md:py-5 outline-none font-serif text-base md:text-lg text-primary placeholder:text-primary/20 min-h-[52px]"
                    />
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/40 block ml-3 md:ml-4">Email Address</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="john@example.com"
                      className="w-full bg-cream/50 border border-transparent focus:border-secondary transition-all rounded-[1rem] md:rounded-[1.5rem] px-6 md:px-8 py-4 md:py-5 outline-none font-serif text-base md:text-lg text-primary placeholder:text-primary/20 min-h-[52px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/40 block ml-3 md:ml-4">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      placeholder="+265..."
                      className="w-full bg-cream/50 border border-transparent focus:border-secondary transition-all rounded-[1rem] md:rounded-[1.5rem] px-6 md:px-8 py-4 md:py-5 outline-none font-serif text-base md:text-lg text-primary placeholder:text-primary/20 min-h-[52px]"
                    />
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/40 block ml-3 md:ml-4">Primary Interest</label>
                    <select
                      value={selectedInterest}
                      onChange={(e) => setSelectedInterest(e.target.value)}
                      className="w-full bg-cream/50 border border-transparent focus:border-secondary transition-all rounded-[1rem] md:rounded-[1.5rem] px-6 md:px-8 py-4 md:py-5 outline-none font-serif text-base md:text-lg text-primary appearance-none cursor-pointer min-h-[52px]"
                    >
                      <option>General Inquiry</option>
                      <option>Goat Farming</option>
                      <option>Poultry Farming</option>
                      <option>Piggery Farming</option>
                      <option>Crop Farming</option>
                      <option>Investment Opportunities</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3">
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/40 block ml-3 md:ml-4">Project Description / Inquiry</label>
                  <textarea
                    rows={6}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    placeholder="How can Kaliyapa Farmstead assist you?"
                    className="w-full bg-cream/50 border border-transparent focus:border-secondary transition-all rounded-[1.5rem] md:rounded-[2rem] px-6 md:px-8 py-4 md:py-5 outline-none font-serif text-base md:text-lg text-primary placeholder:text-primary/20 resize-none min-h-[140px]"
                  ></textarea>
                </div>

                <button
                  disabled={submitting}
                  type="submit"
                  className="btn-premium w-full !text-sm md:!text-base !py-4 md:!py-6 flex items-center justify-center group disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      Submit Formal Request
                      <Send className="ml-3 md:ml-4 h-4 md:h-5 w-4 md:w-5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer Strip with Map */}
      <section className="py-20 md:py-32 lg:py-40 bg-charcoal text-white relative overflow-hidden">
        <Leaf className="absolute -top-20 -left-20 text-white/5 opacity-10" size={400} />
        <div className="max-w-7xl mx-auto px-4 space-y-12 md:space-y-20 relative z-10">
          <div className="text-center space-y-8 md:space-y-12">
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-serif font-bold tracking-tighter">Visit Our Farm.</h2>
            <div className="h-px w-12 md:w-20 bg-secondary mx-auto" />
          </div>

          {/* Map Embed */}
          <div className="premium-card !bg-white/5 border-white/10 p-2 md:p-4">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.123456789!2d33.7663!3d-13.9626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDU3JzQ1LjQiIDEzwrA1Nyc0NS40Ilc!5e0!3m2!1sen!2smw!4v1234567890!5m2!1sen!2smw"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: '1.5rem' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kaliyapa Farmstead Location"
            />
          </div>

          <div className="text-center">
            <p className="text-white/20 text-[10px] font-bold tracking-[0.8em] uppercase">Kaliyapa Farmstead &copy; 2026</p>
          </div>
        </div>
      </section>
    </div>
  );
}
