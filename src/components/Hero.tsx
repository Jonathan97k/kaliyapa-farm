import { ArrowRight, Leaf } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { FARM_NAME, MOTTO, HERO_IMAGES } from '../constants';

export default function Hero() {
  return (
    <div className="relative min-h-screen lg:h-screen flex items-center justify-center overflow-hidden bg-charcoal">
      {/* Full Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGES[0]}
          alt="Kaliyapa Farmstead - Premium livestock farming in Salima, Malawi"
          className="w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/20 to-charcoal/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(26,71,42,0.3),transparent_70%)]" />
      </div>

      <div className="grain-overlay" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 sm:mb-10 inline-flex items-center space-x-2 sm:space-x-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-xl"
        >
          <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-white text-[8px] sm:text-[10px] font-semibold tracking-[0.35em] uppercase">Sustainable Excellence in Malawi</span>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.2 }}
           className="relative"
        >
           <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold mb-4 sm:mb-6 tracking-tight leading-[0.9] sm:leading-[0.85] bg-gradient-to-r from-white via-secondary/90 to-white bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(201,162,39,0.3)]">
            <span className="sr-only">Kaliyapa Farmstead - </span>
            Kaliyapa<br/>Farmstead
          </h1>
          <div className="absolute -top-10 -right-10 hidden lg:block opacity-15">
            <Leaf size={160} className="rotate-45" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mb-10 sm:mb-14 max-w-3xl mx-auto px-4 sm:p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
        >
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-white/90 leading-relaxed italic font-serif text-center">
            "{MOTTO}" — Shaping the future of premium agribusiness with integrity and vision.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5"
        >
          <Link to="/services" className="btn-premium flex items-center justify-center group w-full sm:w-auto min-h-[48px] sm:min-h-auto">
            Explore Services
            <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
          <Link to="/contact" className="btn-premium-outline !border-white/20 !text-white hover:!bg-white hover:!text-charcoal group w-full sm:w-auto min-h-[48px] sm:min-h-auto justify-center flex">
            Get in Touch
          </Link>
        </motion.div>
      </div>

      {/* Floating Meta elements */}
      <div className="absolute bottom-10 left-10 hidden lg:flex items-center gap-4 text-white/40 text-xs font-semibold tracking-widest uppercase">
        <span>Malawi</span>
        <div className="h-px w-8 bg-white/20" />
        <span>Salima District</span>
      </div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 hidden lg:block text-white/20"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] whitespace-nowrap rotate-90 origin-right translate-x-full">Scroll to discover</span>
          <div className="h-16 w-px bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </motion.div>
    </div>
  );
}
