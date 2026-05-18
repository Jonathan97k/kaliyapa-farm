import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from 'react';
import { fetchTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, type Testimonial } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, X, Check, Loader2, Upload, Quote } from 'lucide-react';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    text: '',
    image: ''
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function loadTestimonials() {
    try {
      const data = await fetchTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Failed to load testimonials:', error);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setFormData({ name: '', role: '', text: '', image: '' });
    setEditingTestimonial(null);
  };

  const handleOpenModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        name: testimonial.name,
        role: testimonial.role,
        text: testimonial.text,
        image: testimonial.image || ''
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormData(prev => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      if (editingTestimonial) {
        await updateTestimonial({ id: editingTestimonial.id, ...formData });
      } else {
        await createTestimonial(formData);
      }
      setIsModalOpen(false);
      resetForm();
      await loadTestimonials();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Operation failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await deleteTestimonial(id);
      await loadTestimonials();
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
      <div className="flex justify-between items-center">
        <div>
          <span className="text-secondary text-[10px] font-bold tracking-[0.5em] uppercase block mb-4">Client Voices</span>
          <h1 className="text-5xl font-serif font-bold text-primary tracking-tighter">Testimonials</h1>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-premium flex items-center gap-2"
        >
          <Plus size={20} />
          Add Testimonial
        </button>
      </div>

      {testimonials.length === 0 ? (
        <div className="premium-card p-20 text-center space-y-6">
          <Quote size={60} className="mx-auto text-primary/10" strokeWidth={1} />
          <p className="text-primary/40 font-serif italic text-xl">No testimonials yet.</p>
          <button onClick={() => handleOpenModal()} className="btn-premium">Add First Testimonial</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <motion.div
              layout
              key={t.id}
              className="premium-card p-8 group"
            >
              <div className="flex items-start gap-4 mb-4">
                {t.image ? (
                  <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-secondary/20" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center text-primary font-serif font-bold text-xl">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-serif font-bold text-lg text-primary">{t.name}</h3>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-primary/40">{t.role}</p>
                </div>
              </div>
              <p className="text-primary/70 font-light italic leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex gap-3 pt-4 border-t border-primary/5">
                <button
                  onClick={() => handleOpenModal(t)}
                  className="flex-1 p-3 rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} />
                  <span className="text-[10px] font-bold tracking-widest uppercase">Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-primary/60 backdrop-blur-md z-[110]"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] bg-white z-[120] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-primary/5 flex justify-between items-center bg-cream">
                <h2 className="text-2xl font-serif font-bold text-primary">
                  {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-primary/40 hover:text-primary">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-grow">
                {/* Photo Upload */}
                <div className="flex items-center gap-6">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors overflow-hidden shrink-0 border-2 border-dashed border-primary/20"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="text-primary/30" size={24} />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-primary">Profile Photo</p>
                    <p className="text-xs text-primary/40">Optional. Click to upload.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-primary/40 ml-4">Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Phiri"
                      className="w-full bg-cream p-4 rounded-2xl outline-none focus:ring-2 ring-secondary/20 transition-all font-serif"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-primary/40 ml-4">Role</label>
                    <input
                      required
                      type="text"
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g. Local Distributor"
                      className="w-full bg-cream p-4 rounded-2xl outline-none focus:ring-2 ring-secondary/20 transition-all font-serif"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-primary/40 ml-4">Testimonial</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.text}
                    onChange={e => setFormData({ ...formData, text: e.target.value })}
                    placeholder="What did they say about Kaliyapa Farmstead?"
                    className="w-full bg-cream p-6 rounded-[2rem] outline-none focus:ring-2 ring-secondary/20 transition-all font-serif resize-none"
                  />
                </div>

                <div className="pt-4">
                  <button
                    disabled={processing || !formData.name || !formData.role || !formData.text}
                    type="submit"
                    className="btn-premium w-full flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {processing ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Check size={20} />
                        {editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
