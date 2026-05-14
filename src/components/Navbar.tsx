import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FARM_NAME } from '../constants';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed w-full z-[100] transition-all duration-300 top-0 left-0">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? 'mt-3' : 'mt-0'}`}>
        <div className={`relative flex justify-between items-center transition-all duration-300 px-6 ${
          isScrolled 
            ? 'glass-nav py-3.5 rounded-2xl shadow-md' 
            : 'bg-transparent py-6'
        }`}>
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="h-11 w-11 overflow-hidden transition-all duration-300">
                    <img src="/Logo.jpg" alt="Kaliyapa Farmstead Logo" className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className={`text-lg font-serif font-bold tracking-tight leading-none ${!isScrolled && location.pathname === '/' ? 'text-white' : 'text-primary'}`}>
                {FARM_NAME}
              </span>
              <span className={`text-[9px] font-semibold tracking-[0.25em] uppercase opacity-50 ${!isScrolled && location.pathname === '/' ? 'text-white' : 'text-primary'}`}>
                Premium Excellence
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium tracking-wide hover:text-secondary transition-all relative group ${
                  location.pathname === link.path 
                    ? 'text-secondary font-semibold' 
                    : (!isScrolled && location.pathname === '/' ? 'text-white/80' : 'text-primary/70')
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full ${location.pathname === link.path ? 'w-full' : ''}`} />
              </Link>
            ))}

          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2.5 rounded-xl transition-colors ${isScrolled ? 'bg-primary/5 text-primary' : 'bg-white/10 text-white backdrop-blur-md'}`}
            >
              <AnimatePresence mode="wait">
                {isOpen ? <X key="x" className="h-5 w-5" /> : <Menu key="menu" className="h-5 w-5" />}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-primary/60 backdrop-blur-md z-[90] lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm bg-primary z-[100] lg:hidden p-8 flex flex-col justify-between"
            >
              <div className="space-y-10">
                <div className="flex justify-between items-center">
                  <div className="h-10 w-10 overflow-hidden">
              <img src="/Logo.jpg" alt="Kaliyapa Farmstead Logo" className="h-full w-full object-contain" />
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-2 text-white/50 hover:text-white">
                    <X size={28} />
                  </button>
                </div>
                
                <div className="flex flex-col space-y-6">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`text-3xl font-serif font-bold ${
                          location.pathname === link.path ? 'text-secondary' : 'text-white'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-6 pt-8 border-t border-white/10">
                <div className="space-y-3">
                  <div className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">Direct Access</div>
                  <a href={`tel:${FARM_NAME}`} className="block text-lg font-serif text-white font-semibold">{FARM_NAME}</a>
                </div>
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="btn-premium w-full text-center"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
