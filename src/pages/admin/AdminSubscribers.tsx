import { useState, useEffect } from 'react';
import { fetchSubscribers, deleteSubscriber, type Subscriber } from '../../lib/api';
import { motion } from 'motion/react';
import { Trash2, Mail, Loader2 } from 'lucide-react';

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscribers();
  }, []);

  async function loadSubscribers() {
    try {
      const data = await fetchSubscribers();
      setSubscribers(data);
    } catch (error) {
      console.error('Failed to load subscribers:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this subscriber?')) return;
    try {
      await deleteSubscriber(id);
      await loadSubscribers();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-secondary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div>
        <span className="text-secondary text-[10px] font-bold tracking-[0.5em] uppercase block mb-4">Audience</span>
        <h1 className="text-5xl font-serif font-bold text-primary tracking-tighter">Subscribers</h1>
        <p className="text-primary/40 text-sm mt-4 font-light">{subscribers.length} professional channels enrolled</p>
      </div>

      {subscribers.length === 0 ? (
        <div className="premium-card p-20 text-center space-y-6">
          <Mail size={60} className="mx-auto text-primary/10" strokeWidth={1} />
          <p className="text-primary/40 font-serif italic text-xl">No subscribers yet.</p>
        </div>
      ) : (
        <div className="premium-card overflow-hidden">
          <div className="divide-y divide-primary/5">
            {subscribers.map((sub, i) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between p-6 hover:bg-primary/[0.02] transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Mail size={16} className="text-secondary" />
                  </div>
                  <div>
                    <div className="font-medium text-primary">{sub.email}</div>
                    <div className="text-[10px] font-bold tracking-widest uppercase text-primary/30">
                      {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : ''}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(sub.id)}
                  className="p-3 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
