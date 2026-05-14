import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Image as ImageIcon, Briefcase, MessageSquare, Inbox, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Services', path: '/admin/services', icon: Briefcase },
    { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
    { name: 'Inquiries', path: '/admin/inquiries', icon: Inbox },
  ];

  return (
    <div className="min-h-screen bg-cream flex flex-col lg:flex-row">
      {/* Mobile Admin Header */}
      <div className="lg:hidden bg-primary text-white p-6 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="text-xl font-serif font-bold italic tracking-tighter text-secondary">Kaliyapa</Link>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white/5 rounded-lg text-secondary"
        >
          {isMobileMenuOpen ? <ChevronRight size={24} className="rotate-90" /> : <LayoutDashboard size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-primary border-t border-white/5 overflow-hidden"
          >
            <nav className="p-6 space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 p-4 rounded-xl ${
                      isActive ? 'bg-secondary text-primary' : 'text-white/70'
                    }`}
                  >
                    <item.icon size={18} />
                    <span className="font-bold tracking-widest uppercase text-[10px]">{item.name}</span>
                  </Link>
                );
              })}
              <button 
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-4 p-4 text-white/40 w-full"
              >
                <LogOut size={18} />
                <span className="font-bold tracking-widest uppercase text-[10px]">Logout</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar (Desktop) */}
      <aside className="w-80 bg-primary text-white hidden lg:flex flex-col p-10 fixed h-full inset-y-0 left-0">
        <div className="mb-20">
          <Link to="/" className="text-2xl font-serif font-bold italic tracking-tighter text-secondary">Kaliyapa</Link>
          <div className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/30 mt-2">Executive Portal</div>
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
            <img 
              src={user?.photoURL || ''} 
              alt={user?.displayName || ''} 
              className="h-10 w-10 rounded-full border border-secondary"
            />
            <div className="overflow-hidden">
              <div className="text-xs font-bold truncate">{user?.displayName}</div>
              <div className="text-[10px] text-white/40 truncate">{user?.email}</div>
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
      <main className="flex-grow lg:ml-80 p-6 lg:p-16">
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
