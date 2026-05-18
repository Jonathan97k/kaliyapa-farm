import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
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
        <div className="relative flex items-center justify-end min-h-[56px] px-6">
          {/* Logo - absolutely positioned, outside the glass bar */}
          <Link to="/" className={`absolute left-6 top-4 z-10 transition-all duration-500 ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="h-36 w-36 rounded-full overflow-hidden">
              <img src="/logo.png" alt="Kaliyapa Farmstead Logo" className="h-full w-full object-cover" style={{ transform: 'scale(1.15)' }} />
            </div>
          </Link>

          {/* Glass bar only around nav links */}
          <div className={`${isScrolled ? 'glass-nav py-3.5 px-6 rounded-2xl shadow-md' : ''}`}>
            <div className="flex items-center min-h-[44px]">
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
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                  className={`p-2.5 rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${isScrolled ? 'bg-primary/5 text-primary' : 'bg-white/10 text-white backdrop-blur-md'}`}
                >
                  <AnimatePresence mode="wait">
                    {isOpen ? <X key="x" className="h-5 w-5" /> : <Menu key="menu" className="h-5 w-5" />}
                  </AnimatePresence>
                </button>
              </div>
            </div>
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
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 rounded-full overflow-hidden shrink-0">
                    <img src="/logo.png" alt="Kaliyapa Farmstead Logo" className="h-full w-full object-cover" style={{ transform: 'scale(1.15)' }} />
                  </div>
                  <div>
                    <div className="text-white text-lg font-serif font-bold">{FARM_NAME}</div>
                    <div className="text-white/40 text-[9px] font-semibold tracking-[0.25em] uppercase">Premium Excellence</div>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="ml-auto p-2 text-white/50 hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center">
                    <X size={28} />
                  </button>
                </div>

                <div className="flex flex-col space-y-2">
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
                        className={`block text-3xl font-serif font-bold py-3 min-h-[56px] flex items-center ${
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
                  <a href={`tel:${FARM_NAME}`} className="block text-lg font-serif text-white font-semibold py-2 min-h-[44px] flex items-center">{FARM_NAME}</a>
                </div>
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="btn-premium w-full text-center min-h-[48px] flex items-center justify-center"
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
