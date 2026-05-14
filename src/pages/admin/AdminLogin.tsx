import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Leaf, LogIn, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const { user, login, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  if (loading) return null;
  if (user) return <Navigate to={from} replace />;

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-6 text-white overflow-hidden relative">
      <div className="grain-overlay opacity-5" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full premium-card bg-white/5 border-white/10 p-12 text-center space-y-12 relative z-10"
      >
        <div className="space-y-4">
          <Leaf className="text-secondary h-16 w-16 mx-auto" />
          <h1 className="text-4xl font-serif font-bold tracking-tighter">Executive <br/> Access</h1>
          <p className="text-white/40 text-sm font-light">Secure gateway for Kaliyapa Farmstead administrative controls.</p>
        </div>

        <button 
          onClick={() => login()}
          className="btn-premium w-full flex items-center justify-center gap-4 group"
        >
          <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
          Authorize via Google
        </button>

        <div className="flex items-center justify-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-white/20">
          <ShieldCheck size={12} />
          Encrypted Session
        </div>
      </motion.div>

      {/* Decorative */}
      <div className="absolute -bottom-20 -right-20 text-[30vw] font-serif font-bold text-white/5 tracking-tighter pointer-events-none select-none">
        K.
      </div>
    </div>
  );
}
