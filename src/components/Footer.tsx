import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, CheckCircle2, Loader2 } from 'lucide-react';
import { FARM_NAME, CONTACT_PHONE, LOCATION } from '../constants';
import { subscribe } from '../lib/api';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      await subscribe(email.trim());
      setStatus('success');
      setMessage('Subscribed successfully!');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Could not subscribe. Please try again later or contact us directly.');
    }
  };

  return (
    <footer className="bg-charcoal text-white pt-32 pb-20 overflow-hidden relative">
      {/* Decorative large text bg */}
      <div className="absolute -bottom-10 right-0 text-[20vw] font-serif font-bold text-white/10 tracking-tighter pointer-events-none select-none opacity-30 whitespace-nowrap">
        KALIYAPA
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-10 pb-16 lg:pb-24 border-b border-white/5">
          {/* Brand & Manifesto */}
          <div className="lg:col-span-5 space-y-8 lg:space-y-12">
            <div className="flex items-center gap-4">
              <Leaf className="text-secondary h-6 w-6 sm:h-8 sm:w-8" />
              <span className="text-2xl sm:text-3xl font-serif font-bold tracking-tighter uppercase whitespace-nowrap">
                {FARM_NAME}
              </span>
            </div>
            <p className="text-white/40 text-base sm:text-lg font-light leading-relaxed max-w-md italic font-serif">
              "Biological excellence is not a goal, but a standard we uphold daily. Our legacy is built on the health of our herds and the trust of our partners."
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-secondary">Navigation</h4>
            <ul className="space-y-3 lg:space-y-4">
              {['Home', 'About', 'Services', 'Gallery', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-white/60 hover:text-white text-sm font-medium transition-all group flex items-center py-2">
                    <span className="h-px w-0 group-hover:w-4 bg-secondary mr-0 group-hover:mr-3 transition-all duration-300" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-secondary">Coordinates</h4>
            <div className="space-y-4 lg:space-y-6 text-sm text-white/60 leading-relaxed">
              <p className="break-words">{LOCATION}</p>
              <p>{CONTACT_PHONE}</p>
            </div>
          </div>

          {/* Engagement */}
          <div className="lg:col-span-3 space-y-6 lg:space-y-8">
            <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-secondary">Engagement</h4>
            <div className="space-y-6 lg:space-y-8">
              <p className="text-white/40 text-sm font-light italic">Enter your professional channel for exclusive livestock updates.</p>
              <form onSubmit={handleSubscribe} className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Professional Email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-full px-6 lg:px-8 py-3 lg:py-4 text-sm outline-none focus:border-secondary transition-all pr-24"
                  disabled={status === 'loading'}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="absolute right-1.5 lg:right-2 top-1.5 lg:top-2 bottom-1.5 lg:bottom-2 bg-secondary text-primary px-4 lg:px-6 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-white transition-all transform active:scale-95 min-h-[36px] lg:min-h-auto disabled:opacity-50 flex items-center gap-1"
                >
                  {status === 'loading' ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    'Sign'
                  )}
                </button>
              </form>
              {status === 'success' && (
                <div className="flex items-center gap-2 text-green-400 text-xs">
                  <CheckCircle2 size={14} />
                  {message}
                </div>
              )}
              {status === 'error' && (
                <div className="text-red-400 text-xs">{message}</div>
              )}
            </div>
          </div>
        </div>

        {/* Legal Strip */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/20">
             &copy; {currentYear} KALIYAPA FARMSTEAD &bull; ALL RIGHTS RESERVED
           </div>
           <div className="flex gap-10">
             {['Privacy', 'Ethics', 'Legal'].map(l => (
               <a key={l} href="#" className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/20 hover:text-secondary transition-colors italic">{l}</a>
             ))}
             <Link to="/admin" className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/10 hover:text-secondary transition-colors italic">Portal</Link>
           </div>
        </div>
      </div>
    </footer>
  );
}
