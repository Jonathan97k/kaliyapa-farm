import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Image as ImageIcon, Briefcase, MessageSquare, Inbox, Mail, LogOut, ChevronRight, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Services', path: '/admin/services', icon: Briefcase },
    { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
    { name: 'Inquiries', path: '/admin/inquiries', icon: Inbox },
    { name: 'Subscribers', path: '/admin/subscribers', icon: Mail },
  ];

  const currentPage = menuItems.find(i => location.pathname === i.path)?.name || 'Admin';

  const initials = user?.email?.charAt(0).toUpperCase() || 'A';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-cream flex flex-col lg:flex-row">
      {/* Mobile Admin Header */}
      <div className="lg:hidden bg-primary text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full overflow-hidden shrink-0">
            <img src="/logo.png" alt="Kaliyapa Farmstead" className="h-full w-full object-cover" style={{ transform: 'scale(1.15)' }} />
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-white/40">Executive Portal</div>
            <div className="text-sm font-bold leading-tight">{currentPage}</div>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 bg-white/10 rounded-xl active:bg-white/20 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-[100] lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-[280px] bg-primary z-[110] lg:hidden transform transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden">
                <img src="/logo.png" alt="" className="h-full w-full object-cover" style={{ transform: 'scale(1.15)' }} />
              </div>
              <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40">Executive Portal</div>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-white/50 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-grow space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                    isActive ? 'bg-secondary text-primary shadow-lg shadow-secondary/20' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={20} className={isActive ? 'text-primary' : ''} />
                  <span className="font-bold tracking-widest uppercase text-[11px]">{item.name}</span>
                  {isActive && <ChevronRight size={16} className="ml-auto text-primary" />}
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-secondary/20 border border-secondary flex items-center justify-center text-secondary font-bold text-sm shrink-0">
                {initials}
              </div>
              <div className="overflow-hidden min-w-0">
                <div className="text-xs font-bold truncate text-white/80">{user?.email}</div>
                <div className="text-[10px] text-white/40 truncate">Administrator</div>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="flex items-center gap-3 text-white/40 hover:text-secondary transition-colors w-full p-2"
            >
              <LogOut size={16} />
              <span className="font-bold tracking-widest uppercase text-[10px]">Terminate Session</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="w-80 bg-primary text-white hidden lg:flex flex-col p-10 fixed h-full inset-y-0 left-0">
        <div className="mb-20">
          <Link to="/" className="flex flex-col items-center gap-3">
            <div className="h-24 w-24 rounded-full overflow-hidden">
              <img src="/logo.png" alt="Kaliyapa Farmstead" className="h-full w-full object-cover" style={{ transform: 'scale(1.15)' }} />
            </div>
            <div className="text-center">
              <div className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/30">Executive Portal</div>
            </div>
          </Link>
        </div>

        <nav className="flex-grow space-y-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${
                  isActive ? 'bg-secondary text-primary' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={20} className={isActive ? 'text-primary' : 'text-secondary'} />
                  <span className="font-bold tracking-widest uppercase text-[10px]">{item.name}</span>
                </div>
                <ChevronRight size={16} className={`transition-transform ${isActive ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
              </Link>
            );
          })}
        </nav>

        <div className="pt-10 border-t border-white/10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-secondary/20 border border-secondary flex items-center justify-center text-secondary font-bold">
              {initials}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold truncate">{user?.email}</div>
              <div className="text-[10px] text-white/40 truncate">Administrator</div>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="flex items-center gap-4 text-white/60 hover:text-secondary transition-colors w-full"
          >
            <LogOut size={18} />
            <span className="font-bold tracking-widest uppercase text-[10px]">Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow lg:ml-80 p-6 lg:p-16 relative overflow-hidden">
        {/* Watermark logo behind content */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div className="w-[600px] h-[600px] opacity-[0.04]">
            <img src="/logo.png" alt="" className="w-full h-full object-cover" style={{ transform: 'scale(1.15)' }} />
          </div>
        </div>

        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
