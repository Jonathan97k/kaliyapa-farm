import { motion } from 'motion/react';
import { Briefcase, Image as ImageIcon, MessageSquare, Inbox, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const stats = [
    { name: 'Active Services', value: '3', icon: Briefcase, color: 'text-blue-500' },
    { name: 'Gallery Assets', value: '12', icon: ImageIcon, color: 'text-purple-500' },
    { name: 'Testimonials', value: '8', icon: MessageSquare, color: 'text-amber-500' },
    { name: 'New Inquiries', value: '4', icon: Inbox, color: 'text-secondary' },
  ];

  return (
    <div className="space-y-12">
      <header>
        <span className="text-secondary text-[10px] font-bold tracking-[0.5em] uppercase block mb-4">Operations Overview</span>
        <h1 className="text-5xl font-serif font-bold text-primary tracking-tighter">Welcome, Administrator.</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="premium-card p-10 flex flex-col justify-between group hover:border-secondary transition-all"
          >
            <div className={`p-4 rounded-2xl bg-primary/5 ${stat.color} w-fit`}>
              <stat.icon size={24} />
            </div>
            <div className="mt-8">
              <div className="text-4xl font-serif font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-primary/40">{stat.name}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="premium-card p-12 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-serif font-bold text-primary">System Integrity</h3>
            <TrendingUp className="text-secondary" />
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-primary/60">Cloud Firestore Status</span>
              <span className="text-green-500 font-bold uppercase tracking-widest text-[10px]">Operational</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-primary/60">Security Rules</span>
              <span className="text-green-500 font-bold uppercase tracking-widest text-[10px]">Hardened</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-primary/60">Admin Synchronization</span>
              <span className="text-green-500 font-bold uppercase tracking-widest text-[10px]">Active</span>
            </div>
          </div>
        </div>

        <div className="premium-card p-12 flex flex-col justify-center items-center text-center space-y-6 bg-primary text-white">
          <div className="mx-auto p-6 bg-white/5 rounded-full">
            <Inbox size={40} className="text-secondary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-serif font-bold tracking-tighter">Awaiting Response</h3>
            <p className="text-white/40 text-sm">You have 4 unread professional inquiries.</p>
          </div>
          <Link to="/admin/inquiries" className="btn-premium w-full text-center">Open Professional Inbox</Link>
        </div>
      </div>
    </div>
  );
}
