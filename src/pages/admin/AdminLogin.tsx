import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { LogIn, ShieldCheck, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const { user, login, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to={from} replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-6 text-white overflow-hidden relative">
      <div className="grain-overlay opacity-5" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full premium-card bg-white/5 border-white/10 p-12 text-center space-y-12 relative z-10"
      >
        <div className="space-y-4">
          <div className="h-40 w-40 mx-auto rounded-full overflow-hidden">
            <img src="/logo.png" alt="Kaliyapa Farmstead" className="h-full w-full object-cover" style={{ transform: 'scale(1.4)' }} />
          </div>
          <h1 className="text-4xl font-serif font-bold tracking-tighter">Executive <br/> Access</h1>
          <p className="text-white/40 text-sm font-light">Secure gateway for Kaliyapa Farmstead administrative controls.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-sm text-red-200">
              {error}
            </div>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white placeholder:text-white/40 outline-none focus:border-secondary transition-all"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white placeholder:text-white/40 outline-none focus:border-secondary transition-all"
          />
          <button
            type="submit"
            disabled={submitting}
            className="btn-premium w-full flex items-center justify-center gap-4 group disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                Authorize
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-white/20">
          <ShieldCheck size={12} />
          Encrypted Session
        </div>
      </motion.div>

      <div className="absolute -bottom-20 -right-20 text-[30vw] font-serif font-bold text-white/5 tracking-tighter pointer-events-none select-none">
        K.
      </div>
    </div>
  );
}
