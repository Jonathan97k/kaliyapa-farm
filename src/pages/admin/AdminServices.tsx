import React, { useState, useEffect, useRef } from 'react';
import { fetchServices, createService, updateService, deleteService, type Service } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, X, Check, Loader2, Image as ImageIcon, ArrowUp, ArrowDown, Star, Upload } from 'lucide-react';

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [processing, setProcessing] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    images: [''],
    features: ['']
  });
  const [dragActive, setDragActive] = useState(false);
  const [imageDragActive, setImageDragActive] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageFileInputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setFormData({ title: '', description: '', image: '', images: [''], features: [''] });
    setEditingService(null);
    setSelectedImageIndex(0);
  };

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        description: service.description,
        image: service.image,
        images: service.images && service.images.length > 0 ? [...service.images] : [service.image],
        features: [...service.features]
      });
      setSelectedImageIndex(0);
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
      setFormData(prev => ({ ...prev, image: result, images: [result, ...prev.images.filter(i => i.trim() !== '' && i !== result)] }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageFileSelect = (index: number, file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      handleImageChange(index, result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleImageDrop = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    setImageDragActive(null);
    if (e.dataTransfer.files?.[0]) {
      handleImageFileSelect(index, e.dataTransfer.files[0]);
    }
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

  const handleAddImage = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      if (newImages.length === 0) newImages.push('');
      if (prev.image && !newImages.includes(prev.image)) {
        prev.image = newImages[0];
      }
      return { ...prev, images: newImages };
    });
    if (selectedImageIndex >= formData.images.length - 1) {
      setSelectedImageIndex(Math.max(0, formData.images.length - 2));
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.images.length) return;
    setFormData(prev => {
      const newImages = [...prev.images];
      [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
      return { ...prev, images: newImages };
    });
    setSelectedImageIndex(newIndex);
  };

  const handleSetCoverImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      image: prev.images[index],
      images: [prev.images[index], ...prev.images.filter((_, i) => i !== index)]
    }));
    setSelectedImageIndex(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const cleanImages = formData.images.filter(img => img.trim() !== '');
      if (cleanImages.length === 0) {
        alert('At least one image is required');
        setProcessing(false);
        return;
      }

      const coverImage = formData.image || cleanImages[0];
      if (!cleanImages.includes(coverImage)) {
        cleanImages.unshift(coverImage);
      }

      const cleanData = {
        title: formData.title,
        description: formData.description,
        image: coverImage,
        images: cleanImages,
        features: formData.features.filter(f => f.trim() !== '')
      };

      if (editingService) {
        await updateService({ id: editingService.id, ...cleanData });
      } else {
        await createService(cleanData);
      }
      setIsModalOpen(false);
      resetForm();
      await loadServices();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Operation failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await deleteService(id);
      await loadServices();
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
              <div className="w-full md:w-2/5 h-48 md:h-auto overflow-hidden relative">
                <img src={service.image} className="w-full h-full object-cover img-zoom" alt={service.title} />
                {(service.images && service.images.length > 1) && (
                  <div className="absolute top-3 right-3 bg-primary/80 backdrop-blur-sm text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <ImageIcon size={12} />
                    {service.images.length}
                  </div>
                )}
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

              <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto flex-grow">
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
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-primary/40 ml-4">Cover Image</label>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                        dragActive ? 'border-secondary bg-secondary/5' : 'border-primary/10 hover:border-primary/30'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                        className="hidden"
                      />
                      {formData.image ? (
                        <div className="space-y-2">
                          <img src={formData.image} alt="Cover preview" className="max-h-32 mx-auto rounded-xl object-contain" />
                          <p className="text-xs text-primary/60">Click or drop to change</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="mx-auto text-primary/30" size={32} />
                          <p className="text-primary/60 text-sm font-medium">Drag & drop cover image</p>
                          <p className="text-primary/30 text-xs">or click to browse</p>
                        </div>
                      )}
                    </div>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={e => setFormData({...formData, image: e.target.value})}
                      className="w-full bg-cream p-4 rounded-2xl outline-none focus:ring-2 ring-secondary/20 transition-all text-sm font-mono"
                      placeholder="Or paste image URL"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-primary/40 ml-4">Gallery Images ({formData.images.filter(i => i.trim()).length}/15)</label>
                    <button
                      type="button"
                      onClick={handleAddImage}
                      disabled={formData.images.filter(i => i.trim()).length >= 15}
                      className="text-[10px] font-bold tracking-widest uppercase text-secondary hover:text-primary transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus size={12} /> Add Image
                    </button>
                  </div>

                  {/* Image Preview */}
                  {formData.images.filter(i => i.trim()).length > 0 && (
                    <div className="bg-cream rounded-2xl p-4 space-y-4">
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {formData.images.map((img, index) => img.trim() && (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setSelectedImageIndex(index)}
                            className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                              selectedImageIndex === index ? 'border-secondary shadow-lg shadow-secondary/20' : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={img} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                            {index === 0 && (
                              <div className="absolute inset-0 bg-secondary/80 flex items-center justify-center">
                                <span className="text-[8px] font-bold text-primary uppercase tracking-wider">Cover</span>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>

                      {formData.images[selectedImageIndex]?.trim() && (
                        <div className="rounded-xl overflow-hidden">
                          <img
                            src={formData.images[selectedImageIndex]}
                            alt={`Selected preview`}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Image URL Inputs */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {formData.images.map((img, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <div className="flex-grow flex gap-2">
                          <div className="relative flex-grow">
                            <input
                              type="url"
                              value={img}
                              onChange={e => handleImageChange(index, e.target.value)}
                              placeholder={`https://example.com/image-${index + 1}.jpg`}
                              className="w-full bg-cream px-4 py-3 rounded-xl outline-none focus:ring-2 ring-secondary/20 text-sm font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => imageFileInputs.current[index]?.click()}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary/30 hover:text-secondary transition-colors"
                              title="Upload from file"
                            >
                              <Upload size={14} />
                            </button>
                            <input
                              ref={el => imageFileInputs.current[index] = el}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => e.target.files?.[0] && handleImageFileSelect(index, e.target.files[0])}
                            />
                          </div>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetCoverImage(index)}
                              className="p-3 text-primary/40 hover:text-secondary transition-colors"
                              title="Set as cover"
                            >
                              <Star size={16} />
                            </button>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveImage(index, 'up')}
                            disabled={index === 0}
                            className="p-3 text-primary/30 hover:text-primary transition-colors disabled:opacity-20"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveImage(index, 'down')}
                            disabled={index === formData.images.length - 1}
                            className="p-3 text-primary/30 hover:text-primary transition-colors disabled:opacity-20"
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="p-3 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
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
