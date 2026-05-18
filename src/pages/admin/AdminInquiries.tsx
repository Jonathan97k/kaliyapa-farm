import { useState, useEffect } from 'react';
import { fetchInquiries, deleteInquiry, type Inquiry } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Inbox, Mail, Phone, User, Loader2 } from 'lucide-react';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInquiries();
  }, []);

  async function loadInquiries() {
    try {
      const data = await fetchInquiries();
      setInquiries(data);
    } catch (error) {
      console.error('Failed to load inquiries:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await deleteInquiry(id);
      await loadInquiries();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Delete failed');
    }
  };

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr + 'Z');
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-secondary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header>
        <span className="text-secondary text-[10px] font-bold tracking-[0.5em] uppercase block mb-4">Direct Communication</span>
        <h1 className="text-5xl font-serif font-bold text-primary tracking-tighter">Professional Inquiries</h1>
      </header>

      {inquiries.length === 0 ? (
        <div className="premium-card p-20 text-center space-y-6">
          <Inbox size={60} className="mx-auto text-primary/10" strokeWidth={1} />
          <p className="text-primary/40 font-serif italic text-xl">The registry is currently clear.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {inquiries.map((inquiry) => (
            <motion.div
              layout
              key={inquiry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="premium-card p-10 group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-3 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                      <User size={18} />
                    </div>
                    <div className="font-serif font-bold text-lg text-primary">{inquiry.name}</div>
                  </div>
                  <div className="space-y-3">
                    <a href={`mailto:${inquiry.email}`} className="flex items-center gap-3 text-sm text-primary/60 hover:text-secondary transition-colors">
                      <Mail size={14} /> {inquiry.email}
                    </a>
                    {inquiry.phone && (
                      <a href={`tel:${inquiry.phone}`} className="flex items-center gap-3 text-sm text-primary/60 hover:text-secondary transition-colors">
                        <Phone size={14} /> {inquiry.phone}
                      </a>
                    )}
                    <div className="flex items-center gap-3 text-sm text-primary/30">
                      {formatDate(inquiry.created_at)}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1 h-px lg:h-full lg:w-px bg-primary/5" />

                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold tracking-widest uppercase bg-secondary/10 text-primary px-3 py-1 rounded-full">
                      {inquiry.interest}
                    </span>
                  </div>
                  <p className="text-primary/70 font-light leading-relaxed whitespace-pre-wrap italic">
                    "{inquiry.message}"
                  </p>
                </div>

                <div className="lg:col-span-2 flex items-center justify-end">
                  <button
                    onClick={() => handleDelete(inquiry.id)}
                    className="p-4 rounded-2xl bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
