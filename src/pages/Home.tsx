import { ArrowRight, CheckCircle2, Quote, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { FARM_NAME, CONTACT_PHONE } from '../constants';
import { useState, useEffect } from 'react';
import { fetchServices, fetchTestimonials, type Service, type Testimonial } from '../lib/api';
import SEO from '../components/SEO';

function ServiceImageGallery({ service }: { service: Service }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = service.images && service.images.length > 0 ? service.images : [service.image];

  if (images.length <= 1) {
    return (
      <div className="h-[50%] md:h-[55%] overflow-hidden">
        <img src={images[0]} className="w-full h-full object-cover img-zoom" alt={service.title} />
      </div>
    );
  }

  return (
    <div className="h-[50%] md:h-[55%] overflow-hidden relative group">
      <img
        src={images[currentIndex]}
        className="w-full h-full object-cover img-zoom"
        alt={`${service.title} - Image ${currentIndex + 1}`}
      />
      <div className="absolute inset-0 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1); }}
          className="ml-3 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1); }}
          className="mr-3 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors"
        >
          <ChevronRight size={20} className="text-white" />
        </button>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
            className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-secondary w-4' : 'bg-white/40 hover:bg-white/60'}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesData, testimonialsData] = await Promise.all([
          fetchServices(),
          fetchTestimonials(),
        ]);
        setServices(servicesData.slice(0, 3));
        setTestimonials(testimonialsData);
      } catch (error) {
        console.error('Error fetching data for home:', error);
      } finally {
        setLoadingServices(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="bg-cream">
      <SEO
        title="Home - Premium Livestock Farming in Malawi"
        description="Kaliyapa Farmstead offers premium goat farming, poultry, and piggery services in Salima, Malawi. Quality livestock with sustainable practices since 2008."
        keywords="goat farming Malawi, poultry farming, piggery, livestock Salima, Boer goats, sustainable farming"
        canonicalUrl="https://kaliyapafarmstead.com/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Kaliyapa Farmstead",
          "url": "https://kaliyapafarmstead.com",
          "description": "Premium livestock farming in Salima, Malawi",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://kaliyapafarmstead.com/services",
            "query-input": "required name=search_term_string"
          }
        }}
      />
      <Hero />

      {/* Trust Strip */}
      <section className="py-8 md:py-10 bg-primary border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 md:gap-x-16 gap-y-4 text-white/40">
            <div className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">★ Est. 2008</div>
            <div className="hidden md:block h-3 w-px bg-white/20" />
            <div className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">Salima · Malawi</div>
            <div className="hidden md:block h-3 w-px bg-white/20" />
            <div className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">5,000+ Annual Yield</div>
            <div className="hidden md:block h-3 w-px bg-white/20" />
            <div className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">100% Quality Assured</div>
          </div>
        </div>
      </section>

      {/* Intro Section - High Contrast */}
      <section className="py-20 md:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-end">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="section-label mb-6 md:mb-8">The Kaliyapa Standard</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-primary leading-[0.9] tracking-tight mt-4">
                Redefining <br/> Agricultural <br/> <span className="italic text-secondary">Excellence.</span>
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4 md:space-y-6"
            >
              <p className="text-base md:text-lg lg:text-xl text-primary/70 leading-relaxed font-light font-serif italic">
                "We don't just produce livestock; we curate the highest standard of biological excellence in the heart of Salima."
              </p>
              <div className="h-px w-full bg-primary/10" />
              <div className="flex justify-between items-center text-[10px] md:text-xs font-semibold tracking-widest uppercase text-primary/50">
                <span>Est. 2008</span>
                <span>Lifidzi Region</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bento Grid Specialties */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bento-grid">
            {loadingServices ? (
              <div className="md:col-span-2 lg:row-span-2 premium-card p-12 md:p-20 flex items-center justify-center">
                <Loader2 className="animate-spin text-secondary" size={48} />
              </div>
            ) : services.length === 0 ? null : (
              <>
                {services[0] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="md:col-span-2 lg:row-span-2 premium-card group"
                >
                  <div className="h-full flex flex-col">
                    <ServiceImageGallery service={services[0]} />
                    <div className="p-5 md:p-7 lg:p-10 flex flex-col justify-between flex-grow">
                      <div>
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-primary mb-2 md:mb-3">{services[0].title}</h3>
                        <p className="text-primary/60 text-sm md:text-base lg:text-lg font-light mb-4 md:mb-6 max-w-sm line-clamp-2">{services[0].description}</p>
                      </div>
                      <Link to="/services" className="inline-flex items-center text-secondary font-semibold tracking-wider uppercase text-[10px] md:text-xs">
                        Learn More <ArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
                )}

                {services[1] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="md:col-span-1 lg:col-span-2 premium-card group bg-primary text-white border-none"
                >
                  <div className="flex h-full flex-col sm:flex-row">
                    <div className="w-full sm:w-1/2 p-5 md:p-8 flex flex-col justify-center">
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-secondary mb-2 md:mb-3">{services[1].title}</h3>
                      <Link to="/services" className="text-white/40 hover:text-white transition-colors text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase">View Gallery</Link>
                    </div>
                    <div className="w-full sm:w-1/2 h-40 sm:h-auto overflow-hidden relative">
                      <img src={services[1].image} className="w-full h-full object-cover opacity-80 img-zoom" alt={services[1].title} />
                      {(services[1].images?.length || 0) > 1 && (
                        <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded-full">
                          +{(services[1].images?.length || 1) - 1}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
                )}

                {services[2] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="md:col-span-1 lg:col-span-2 premium-card group"
                >
                  <div className="flex h-full flex-col sm:flex-row-reverse">
                    <div className="w-full sm:w-1/2 p-5 md:p-8 flex flex-col justify-center">
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-primary mb-2 md:mb-3">{services[2].title}</h3>
                      <Link to="/services" className="text-primary/40 hover:text-primary transition-colors text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase">Inquire</Link>
                    </div>
                    <div className="w-full sm:w-1/2 h-40 sm:h-auto overflow-hidden relative">
                      <img src={services[2].image} className="w-full h-full object-cover img-zoom" alt={services[2].title} />
                      {(services[2].images?.length || 0) > 1 && (
                        <div className="absolute top-2 right-2 bg-primary/20 backdrop-blur-sm text-primary text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded-full">
                          +{(services[2].images?.length || 1) - 1}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Signature Values - Minimalist */}
      <section className="py-20 md:py-32 lg:py-40 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 md:mb-24 lg:mb-32">
            <span className="text-secondary text-xs font-bold tracking-[0.6em] uppercase block mb-6 md:mb-8">Our DNA</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-bold tracking-tighter">The Invariants of Success.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { title: "Precision Genetics", desc: "Sourcing only the most resilient lineages" },
              { title: "Ethical Standards", desc: "Animal welfare as the foundation of quality" },
              { title: "Sustainable Growth", desc: "Balancing productivity with environmental stewardship" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-4 md:space-y-6"
              >
                <CheckCircle2 className="mx-auto text-secondary h-8 w-8 md:h-12 md:w-12" />
                <h3 className="text-lg md:text-xl lg:text-2xl font-serif font-bold">{item.title}</h3>
                <p className="text-white/60 text-sm md:text-base font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Editorial Gallery Style */}
      <section className="py-20 md:py-32 lg:py-40 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 md:gap-20 items-center">
            <div className="lg:w-1/3">
              <Quote className="text-secondary/20 h-16 md:h-24 -ml-2 md:-ml-4 mb-6 md:mb-8" strokeWidth={1} />
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-6 md:mb-8 leading-tight">Trusted by Industry Leaders.</h2>
              <div className="flex gap-3 md:gap-4">
                <button className="p-3 md:p-4 rounded-full border border-primary/10 hover:bg-primary hover:text-white transition-all"><ArrowRight className="rotate-180" /></button>
                <button className="p-3 md:p-4 rounded-full border border-primary/10 hover:bg-primary hover:text-white transition-all"><ArrowRight /></button>
              </div>
            </div>
            <div className="lg:w-2/3 flex gap-6 md:gap-8 overflow-x-auto pb-8 md:pb-12 snap-x snap-mandatory no-scrollbar">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  className="min-w-[280px] md:min-w-[350px] lg:min-w-[450px] snap-center p-6 md:p-10 lg:p-16 bg-white rounded-[2rem] md:rounded-[3rem] border border-primary/5 shadow-2xl shadow-primary/5 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                    {('image' in t && t.image) && (
                      <img
                        src={t.image as string}
                        alt={t.name}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-secondary/20"
                      />
                    )}
                    <div>
                      <div className="font-bold text-primary text-base md:text-lg">{t.name}</div>
                      <div className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">{'role' in t ? t.role : ''}</div>
                    </div>
                  </div>
                  <Quote className="text-secondary/10 h-8 md:h-12 mb-4 md:mb-6" strokeWidth={1} />
                  <p className="text-lg md:text-xl lg:text-2xl font-serif italic text-primary/80 leading-relaxed">"{'text' in t ? t.text : ''}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Strip */}
      <section className="py-20 md:py-32 lg:py-40 bg-secondary relative overflow-hidden text-primary">
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-8 md:mb-12">Ready to Partner with Excellence?</h2>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
            <Link to="/contact" className="btn-premium">Initiate Dialogue</Link>
            <Link to="/services" className="btn-premium-outline !border-primary !text-primary hover:!bg-primary hover:!text-white">Explore Services</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
