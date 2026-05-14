import { ReactNode, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';
import { MessageCircle } from 'lucide-react';
import { CONTACT_PHONE } from '../constants';

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Get clean phone number for WhatsApp (remove spaces and special chars)
  const whatsappNumber = CONTACT_PHONE.replace(/\s+/g, '').replace(/[^+]/g, '');

  return (
    <div className="flex flex-col min-h-screen bg-cream selection:bg-secondary/20 overflow-x-hidden">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

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