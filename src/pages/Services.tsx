import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, MessageSquare, Quote, Loader2, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useState, useEffect } from 'react';
import { SERVICES as FALLBACK_SERVICES } from '../constants';
import { fetchServices, type Service } from '../lib/api';
import SEO from '../components/SEO';

function ServiceGallery({ service, index }: { service: Service; index: number }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const images = service.images && service.images.length > 0 ? service.images : [service.image];
  const isReversed = index % 2 !== 0;

  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
        }}
        className={`flex flex-col lg:flex-row gap-12 md:gap-20 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}
      >
        {/* Media Part */}
        <div className="w-full lg:w-3/5 relative">
          <div className="absolute inset-0 bg-secondary/10 rounded-[2rem] md:rounded-[4rem] translate-x-4 md:translate-x-6 translate-y-4 md:translate-y-6 -z-10" />
          <div className="rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl relative aspect-[16/10] group">
            <img
              src={images[currentImage]}
              alt={`${service.title} - Image ${currentImage + 1}`}
              className="w-full h-full object-cover img-zoom"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent" />

            {images.length > 1 && (
              <>
                <div className="absolute inset-0 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity px-4 md:px-8">
                  <button
                    onClick={() => setCurrentImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                    className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors"
                  >
                    <ChevronLeft size={24} className="text-white" />
                  </button>
                  <button
                    onClick={() => setCurrentImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                    className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors"
                  >
                    <ChevronRight size={24} className="text-white" />
                  </button>
                </div>

                <div className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`h-2 rounded-full transition-all ${i === currentImage ? 'bg-secondary w-6' : 'bg-white/40 w-2 hover:bg-white/60'}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setLightboxOpen(true)}
                  className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Maximize2 size={18} className="text-white" />
                </button>
              </>
            )}

            {/* Service number badge */}
            <div className="absolute top-6 md:top-10 right-6 md:right-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-white text-[10px] font-bold tracking-[0.3em] uppercase">
              Service 0{index + 1}
            </div>

            <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 md:right-10 flex items-end justify-between">
              <div>
                <div className="text-white/70 text-[10px] font-bold tracking-[0.4em] uppercase mb-2">Category</div>
                <div className="text-white text-2xl md:text-4xl font-serif font-bold uppercase">{service.title.split(' ')[0]}</div>
              </div>
              <div className="hidden md:flex h-14 w-14 rounded-full bg-secondary items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <ArrowRight />
              </div>
            </div>
          </div>
        </div>

        {/* Text Part */}
        <div className="w-full lg:w-2/5 space-y-6 md:space-y-8">
          <div>
            <span className="section-label mb-4 md:mb-6">0{index + 1} / 0{services.length}</span>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary tracking-tight leading-[1.1] mt-4">
              {service.title}
            </h3>
          </div>

          <p className="text-base md:text-lg text-primary/60 font-light leading-relaxed">
            {service.description}
          </p>

          <div className="grid grid-cols-2 gap-3 md:gap-4 pt-4">
            {service.features.map((feature: string, i: number) => (
              <div key={i} className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-white/60 rounded-xl border border-primary/5 group hover:border-secondary/30 hover:bg-secondary/5 transition-all">
                <div className="h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                <span className="text-[10px] md:text-xs font-bold tracking-wider uppercase text-primary/70 group-hover:text-primary">{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 md:pt-6 flex flex-col sm:flex-row gap-4">
            <Link to="/contact" state={{ interest: service.title }} className="btn-premium flex items-center justify-center group text-sm md:text-base">
              Inquire Specification
              <ArrowRight className="ml-2 md:ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact" state={{ interest: service.title }} className="btn-premium-outline flex items-center justify-center group !px-6 md:!px-8 text-sm md:text-base">
              <MessageSquare className="mr-2 md:mr-3 h-4 w-4" />
              Consultation
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-[200] bg-primary/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10"
            >
              <X size={24} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); setCurrentImage(prev => prev === 0 ? images.length - 1 : prev - 1); }}
              className="absolute left-4 md:left-8 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            >
              <ChevronLeft size={32} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); setCurrentImage(prev => prev === images.length - 1 ? 0 : prev + 1); }}
              className="absolute right-4 md:right-8 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            >
              <ChevronRight size={32} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl max-h-[85vh]"
            >
              <img
                src={images[currentImage]}
                alt={`${service.title} - Image ${currentImage + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              />
              <div className="text-center mt-4">
                <div className="text-secondary text-[10px] font-bold tracking-[0.3em] uppercase mb-1">{service.title}</div>
                <div className="text-white/40 text-xs">{currentImage + 1} / {images.length}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Services() {
  const [services, setServices] = useState<Service[]>(FALLBACK_SERVICES as Service[]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadServices() {
      setLoading(true);
      try {
        const data = await fetchServices();
        if (data.length > 0) setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="bg-cream min-h-screen">
      <SEO
        title="Our Services - Goat, Poultry & Piggery Farming"
        description="Explore our premium livestock services: Boer goat farming, quality poultry production, and modern piggery operations in Salima, Malawi."
        keywords="goat farming services, poultry farming, piggery Malawi, Boer goats, livestock breeding, quality meat production"
        canonicalUrl="https://kaliyapafarmstead.com/services"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Kaliyapa Farmstead Services",
          "itemListElement": services.map((service, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "Service",
              "name": service.title,
              "description": service.description,
              "provider": {
                "@type": "Organization",
                "name": "Kaliyapa Farmstead"
              }
            }
          }))
        }}
      />
      {/* Header */}
      <section className="pt-40 md:pt-48 pb-20 md:pb-32 px-4 bg-primary text-white overflow-hidden relative">
        <div className="grain-overlay opacity-10" />
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-badge mb-8 md:mb-12"
          >
            ★ Capabilities Portfolio
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold leading-[0.9] tracking-tighter mb-8 md:mb-12"
          >
            The Art of <br/> <span className="italic text-secondary">Husbandry.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base md:text-xl text-white/50 font-light italic font-serif max-w-2xl mx-auto mb-12 md:mb-20"
          >
            Detailed specifications of our primary agricultural focuses, engineered for maximum performance and health.
          </motion.p>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 max-w-4xl mx-auto pt-8 md:pt-12 border-t border-white/10"
          >
            {[
              { num: "4+", label: "Service Verticals" },
              { num: "16+", label: "Years Excellence" },
              { num: "5K+", label: "Annual Yield" },
              { num: "100%", label: "Quality Assured" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-5xl font-serif font-bold text-secondary leading-none">{stat.num}</div>
                <div className="text-[9px] md:text-[10px] font-bold tracking-[0.3em] uppercase opacity-40 mt-2 md:mt-3">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Detailed Services */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto space-y-20 md:space-y-40">
          {loading ? (
            <div className="flex justify-center p-20"><Loader2 className="animate-spin text-secondary" /></div>
          ) : (
            services.map((service, index) => (
              <motion.div
                key={service.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={itemVariants}
                className={`flex flex-col lg:flex-row gap-12 md:gap-20 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Media Part */}
                <div className="w-full lg:w-3/5 relative">
                  <div className="absolute inset-0 bg-secondary/10 rounded-[2rem] md:rounded-[4rem] translate-x-4 md:translate-x-6 translate-y-4 md:translate-y-6 -z-10" />
                  <div className="rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl relative aspect-[16/10] group">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover img-zoom"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent" />

                    {/* Service number badge */}
                    <div className="absolute top-6 md:top-10 right-6 md:right-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-white text-[10px] font-bold tracking-[0.3em] uppercase">
                      Service 0{index + 1}
                    </div>

                    <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 md:right-10 flex items-end justify-between">
                      <div>
                        <div className="text-white/70 text-[10px] font-bold tracking-[0.4em] uppercase mb-2">Category</div>
                        <div className="text-white text-2xl md:text-4xl font-serif font-bold uppercase">{service.title.split(' ')[0]}</div>
                      </div>
                      <div className="hidden md:flex h-14 w-14 rounded-full bg-secondary items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <ArrowRight />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text Part */}
                <div className="w-full lg:w-2/5 space-y-6 md:space-y-8">
                  <div>
                    <span className="section-label mb-4 md:mb-6">0{index + 1} / 0{services.length}</span>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary tracking-tight leading-[1.1] mt-4">
                      {service.title}
                    </h3>
                  </div>

                  <p className="text-base md:text-lg text-primary/60 font-light leading-relaxed">
                    {service.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 md:gap-4 pt-4">
                    {service.features.map((feature: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-white/60 rounded-xl border border-primary/5 group hover:border-secondary/30 hover:bg-secondary/5 transition-all">
                        <div className="h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                        <span className="text-[10px] md:text-xs font-bold tracking-wider uppercase text-primary/70 group-hover:text-primary">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 md:pt-6 flex flex-col sm:flex-row gap-4">
                    <Link to="/contact" state={{ interest: service.title }} className="btn-premium flex items-center justify-center group text-sm md:text-base">
                      Inquire Specification
                      <ArrowRight className="ml-2 md:ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/contact" state={{ interest: service.title }} className="btn-premium-outline flex items-center justify-center group !px-6 md:!px-8 text-sm md:text-base">
                      <MessageSquare className="mr-2 md:mr-3 h-4 w-4" />
                      Consultation
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Quality Pillar - Full Width Visual */}
      <section className="py-20 md:py-32 lg:py-40 relative flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1548550023-2940bc276326?auto=format&fit=crop&q=80&w=1920"
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-110"
          alt="Quality"
        />
        <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <Quote className="text-secondary/20 h-16 md:h-24 mx-auto mb-8 md:mb-12" strokeWidth={1} />
          <h2 className="text-2xl md:text-4xl lg:text-6xl font-serif font-bold tracking-tighter mb-8 md:mb-16">Biological excellence is never an accident; it is the result of architectural intent.</h2>
          <div className="flex justify-center gap-4 md:gap-8 text-[10px] font-bold tracking-[0.5em] uppercase text-white/40">
            <span>ISO Quality</span>
            <div className="h-0.5 w-6 md:w-8 bg-white/20 mt-1.5" />
            <span>Malawi Certified</span>
          </div>
        </div>
      </section>
    </div>
  );
}
