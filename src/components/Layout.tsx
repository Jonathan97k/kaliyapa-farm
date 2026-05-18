import { ReactNode, useEffect, useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';
import { MessageCircle, Bird, Feather } from 'lucide-react';
import { CONTACT_PHONE } from '../constants';

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation();
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const whatsappNumber = CONTACT_PHONE.replace(/\s+/g, '').replace(/[^0-9+]/g, '');

  return (
    <div className="flex flex-col min-h-screen bg-cream selection:bg-secondary/20 overflow-x-hidden relative">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {/* Flying Birds Animation - Global */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {/* Large Eagle-like bird - slow majestic flight */}
        <motion.div
          animate={{
            x: [-100, windowWidth + 100],
            y: [80, 60, 100, 70, 90]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0
          }}
          className="absolute top-16 opacity-15"
        >
          <Bird size={32} className="text-primary/20 drop-shadow-sm" />
        </motion.div>

        {/* Medium sized birds - faster, more erratic */}
        <motion.div
          animate={{
            x: [windowWidth + 50, -50],
            y: [120, 100, 140, 110, 130]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute top-24 opacity-12"
        >
          <Bird size={24} className="text-secondary/15 drop-shadow-sm" />
        </motion.div>

        <motion.div
          animate={{
            x: [-80, windowWidth + 80],
            y: [160, 140, 180, 150, 170]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8
          }}
          className="absolute top-32 opacity-10"
        >
          <Bird size={20} className="text-primary/18 drop-shadow-sm" />
        </motion.div>

        {/* Small birds - quick, darting flight */}
        <motion.div
          animate={{
            x: [windowWidth + 30, -30],
            y: [200, 180, 220, 190, 210]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
            delay: 2
          }}
          className="absolute top-40 opacity-8"
        >
          <Feather size={16} className="text-secondary/12 drop-shadow-sm" />
        </motion.div>

        <motion.div
          animate={{
            x: [-60, windowWidth + 60],
            y: [240, 220, 260, 230, 250]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6
          }}
          className="absolute top-48 opacity-6"
        >
          <Feather size={14} className="text-primary/14 drop-shadow-sm" />
        </motion.div>

        <motion.div
          animate={{
            x: [windowWidth + 40, -40],
            y: [280, 260, 300, 270, 290]
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "linear",
            delay: 10
          }}
          className="absolute top-56 opacity-7"
        >
          <Bird size={18} className="text-secondary/16 drop-shadow-sm" />
        </motion.div>

        {/* Diagonal flyers */}
        <motion.div
          animate={{
            x: [50, windowWidth - 50],
            y: [100, 150, 120, 170, 130]
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 12
          }}
          className="absolute top-20 left-10 opacity-9"
        >
          <Bird size={22} className="text-primary/17 drop-shadow-sm" />
        </motion.div>

        <motion.div
          animate={{
            x: [windowWidth - 70, 70],
            y: [180, 220, 190, 240, 200]
          }}
          transition={{
            duration: 19,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 16
          }}
          className="absolute top-28 right-10 opacity-11"
        >
          <Feather size={20} className="text-secondary/13 drop-shadow-sm" />
        </motion.div>
      </div>

      <Navbar />
      <main id="main-content" className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {children || <Outlet />}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=Hello%20Kaliyapa%20Farmstead%2C%20I%27m%20interested%20in%20your%20services.`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        className="whatsapp-float"
      >
        <MessageCircle size={32} />
      </a>
    </div>
  );
}