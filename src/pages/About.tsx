import { motion } from 'motion/react';
import { Quote, Leaf, Target, Eye } from 'lucide-react';
import { FARM_NAME, MOTTO, ABOUT_IMAGES } from '../constants';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function About() {
  return (
    <div className="bg-cream">
      <SEO
        title="About Us - Our Heritage & Vision"
        description="Learn about Kaliyapa Farmstead's heritage, philosophy, and mission. Founded in 2008 in Salima, Malawi, we strive for agricultural excellence through sustainable livestock farming."
        keywords="about Kaliyapa Farmstead, farming history Malawi, sustainable agriculture, livestock farming philosophy"
        canonicalUrl="https://kaliyapafarmstead.com/about"
      />
      {/* Editorial Header */}
      <section className="pt-40 md:pt-48 pb-16 md:pb-24 px-4 bg-primary text-white overflow-hidden relative">
        <div className="grain-overlay opacity-10" />
        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-20 w-[30rem] h-[30rem] bg-secondary/5 rounded-full blur-3xl" />
        
        {/* Big background logo - sits behind text, faded for depth */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none"
        >
            <motion.img
              src="/Logo.jpg"
              alt=""
              aria-hidden="true"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="w-[80vw] max-w-[700px] md:max-w-[850px] lg:max-w-[1000px] opacity-[0.18] mix-blend-screen drop-shadow-[0_0_60px_rgba(201,162,39,0.25)] select-none"
              style={{ filter: 'blur(1px)' }}
            />
        </motion.div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-badge mb-8 md:mb-12"
          >
            <Leaf className="h-3 w-3" /> Ancestry & Vision
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold leading-[0.9] tracking-tighter mb-12 md:mb-16"
          >
            The Heritage <br/> of <span className="italic text-secondary">Kaliyapa.</span>
          </motion.h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-end">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg sm:text-xl md:text-2xl font-light text-white/50 italic font-serif max-w-xl"
            >
              "Rooted in the fertile soils of Salima, we've spent decades perfecting the harmony between biological integrity and commercial scalability."
            </motion.p>
            <div className="flex gap-6 sm:gap-12 md:justify-end">
               <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-serif font-bold text-secondary">2008</div>
                  <div className="text-[10px] font-bold tracking-widest uppercase opacity-40">Founded</div>
               </div>
               <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-serif font-bold text-secondary">5000+</div>
                  <div className="text-[10px] font-bold tracking-widest uppercase opacity-40">Annual Yield</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy - Split Layout */}
      <section className="py-20 md:py-32 lg:py-40 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
            <motion.div
              initial={{ opacity: 0, rotate: -2 }}
              whileInView={{ opacity: 1, rotate: 0 }}
              viewport={{ once: true }}
              className="relative p-4 md:p-8"
            >
              <div className="absolute inset-0 bg-primary/5 rounded-[2rem] md:rounded-[4rem] -rotate-3" />
              <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
                 <img 
                    src="https://images.unsplash.com/photo-1544474676-9041bed8f615?auto=format&fit=crop&q=80&w=1200" 
                    alt="Sustainable Farming" 
                    className="w-full h-full object-cover img-zoom"
                 />
              </div>
              <div className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 p-6 md:p-12 bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl max-w-xs hidden xl:block">
                 <div className="text-primary font-serif text-2xl md:text-3xl font-bold mb-4">100%</div>
                 <div className="text-primary/40 text-xs md:text-sm font-bold tracking-widest uppercase mb-4">Organic Growth Focus</div>
                 <div className="h-px w-full bg-primary/10" />
              </div>
            </motion.div>

            <div className="space-y-8 md:space-y-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary leading-tight">Our Philosophy <span className="text-secondary italic">&</span> Methodology.</h2>
              <p className="text-base md:text-lg text-primary/60 font-light leading-relaxed">
                At {FARM_NAME}, we perceive agribusiness as a biological art form. Every decision, from the selection of premium genetics to our meticulously managed feeding programs, is driven by a singular goal: **Total Physiological Excellence.**
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-6 md:pt-8">
                {[
                  { title: "Precision Genetics", desc: "Sourcing only the most resilient and productive lineages." },
                  { title: "Ethical Management", desc: "Prioritizing animal welfare as the foundation of quality." },
                  { title: "Local Empowerment", desc: "Sourcing expertise and labor from our Salima community." },
                  { title: "Innovation", desc: "Applying data-driven insights to traditional practices." }
                ].map((item, i) => (
                  <div key={i} className="group cursor-default">
                    <h4 className="font-serif font-bold text-lg md:text-xl text-primary mb-2 group-hover:text-secondary transition-colors">{item.title}</h4>
                    <p className="text-xs md:text-sm text-primary/50 leading-relaxed font-light">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Large Statement */}
      <section className="py-20 md:py-32 lg:py-40 bg-cream border-y border-primary/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
           <Quote className="text-secondary/10 h-16 md:h-24 lg:h-32 mx-auto mb-8 md:mb-16" strokeWidth={1} />
           <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-4xl lg:text-6xl font-serif text-primary italic leading-tight"
           >
              "{MOTTO}"
           </motion.h3>
        </div>
      </section>

      {/* Mission & Vision - Premium Cards */}
      <section className="py-20 md:py-32 lg:py-40 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="premium-card p-8 md:p-16 space-y-6 md:space-y-8 group border-primary/10"
            >
              <div className="h-12 w-12 md:h-16 md:w-16 bg-primary/5 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors text-primary group-hover:text-white">
                <Target size={32} />
              </div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-primary">Our Mission</h3>
              <p className="text-primary/60 text-base md:text-xl font-light leading-relaxed italic">
                To fulfill aspirations through excellence in sustainable livestock farming.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="premium-card p-8 md:p-16 space-y-6 md:space-y-8 group border-primary/10"
            >
              <div className="h-12 w-12 md:h-16 md:w-16 bg-primary/5 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors text-primary group-hover:text-white">
                <Eye size={32} />
              </div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-primary">Our Vision</h3>
              <p className="text-primary/60 text-base md:text-xl font-light leading-relaxed italic">
                To become a trusted leader in Malawi's livestock sector.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 md:py-32 lg:py-40 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-24"
          >
            <span className="text-secondary text-xs font-bold tracking-[0.6em] uppercase block mb-6 md:mb-8">Leadership Team</span>
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-serif font-bold text-primary tracking-tighter">Meet the Experts.</h2>
          </motion.div>
          
          <div className="flex justify-center">
            {ABOUT_IMAGES.team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="premium-card p-6 md:p-8 text-center group border-primary/10 max-w-sm w-full"
              >
                <div className="relative mb-6 md:mb-8 mx-auto w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover img-zoom"
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-primary mb-1">{member.name}</h3>
                <p className="text-secondary text-xs md:text-sm font-bold tracking-widest uppercase mb-3">{member.role}</p>
                <p className="text-primary/60 text-sm md:text-base font-light leading-relaxed">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section inherited from global styles */}
      <section className="py-20 md:py-32 lg:py-40 bg-primary text-white text-center">
         <div className="max-w-3xl mx-auto px-4">
            <Leaf className="text-secondary/30 h-16 md:h-24 mx-auto mb-8 md:mb-12 animate-pulse" />
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tighter mb-8 md:mb-12">Building a future of abundance together.</h2>
            <Link to="/contact" className="btn-premium !bg-white !text-primary transform hover:scale-110">Establish Dialogue</Link>
         </div>
      </section>
    </div>
  );
}
