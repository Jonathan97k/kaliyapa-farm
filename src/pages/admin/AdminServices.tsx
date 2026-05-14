import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, addDoc, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, X, Check, Loader2, Image as ImageIcon } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [processing, setProcessing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    features: ['']
  });

  useEffect(() => {
    const q = query(collection(db, 'services'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
      setServices(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'services');
    });

    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setFormData({ title: '', description: '', image: '', features: [''] });
    setEditingService(null);
  };

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        description: service.description,
        image: service.image,
        features: [...service.features]
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleAddFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const cleanData = {
        ...formData,
        features: formData.features.filter(f => f.trim() !== '')
      };

      if (editingService) {
        await updateDoc(doc(db, 'services', editingService.id), cleanData);
      } else {
        await addDoc(collection(db, 'services'), cleanData);
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'services');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'services');
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
          <span className="text-secondary text-[10px] font-bold tracking-[0.5em] uppercase block mb-4">Content Management</span>
          <h1 className="text-5xl font-serif font-bold text-primary tracking-tighter">Farming Services</h1>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-premium flex items-center gap-2"
        >
          <Plus size={20} />
          New Specification
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {services.map((service) => (
          <div key={service.id} className="premium-card overflow-hidden group">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-2/5 h-48 md:h-auto overflow-hidden">
                <img src={service.image} className="w-full h-full object-cover img-zoom" alt={service.title} />
              </div>
              <div className="w-full md:w-3/5 p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-primary mb-2">{service.title}</h3>
                  <p className="text-primary/60 text-sm line-clamp-3 mb-6 font-light">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((f, i) => (
                      <span key={i} className="text-[10px] font-bold tracking-widest uppercase bg-primary/5 px-3 py-1 rounded-full text-primary/40 leading-none">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-primary/5 flex gap-4">
                  <button 
                    onClick={() => handleOpenModal(service)}
                    className="flex-1 p-3 rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} />
                    <span className="text-[10px] font-bold tracking-widest uppercase">Edit</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(service.id)}
                    className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

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
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl md:max-h-[90vh] bg-white z-[120] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-10 border-b border-primary/5 flex justify-between items-center bg-cream">
                <h2 className="text-3xl font-serif font-bold text-primary">
                  {editingService ? 'Edit Specification' : 'New Specification'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-primary/40 hover:text-primary">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto flex-grow scrollbar-thin">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-primary/40 ml-4">Title</label>
                    <input 
                      required
                      type="text" 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-cream p-4 rounded-2xl outline-none focus:ring-2 ring-secondary/20 transition-all font-serif text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-primary/40 ml-4">Image URL</label>
                    <input 
                      required
                      type="url" 
                      value={formData.image}
                      onChange={e => setFormData({...formData, image: e.target.value})}
                      className="w-full bg-cream p-4 rounded-2xl outline-none focus:ring-2 ring-secondary/20 transition-all text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-primary/40 ml-4">Description</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-cream p-6 rounded-[2rem] outline-none focus:ring-2 ring-secondary/20 transition-all font-serif text-md resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-primary/40 ml-4">Key Features</label>
                    <button 
                      type="button" 
                      onClick={handleAddFeature}
                      className="text-[10px] font-bold tracking-widest uppercase text-secondary hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <Plus size={12} /> Add Feature
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input 
                          type="text" 
                          value={feature}
                          onChange={e => handleFeatureChange(index, e.target.value)}
                          placeholder="e.g. Boer Breeding"
                          className="flex-grow bg-cream px-4 py-3 rounded-xl outline-none focus:ring-2 ring-secondary/20 text-sm"
                        />
                        <button 
                          type="button" 
                          onClick={() => handleRemoveFeature(index)}
                          className="p-3 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    disabled={processing}
                    type="submit" 
                    className="btn-premium w-full flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {processing ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Check size={20} />
                        Save Professional Specification
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
