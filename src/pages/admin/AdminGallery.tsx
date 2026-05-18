import React, { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from 'react';
import { fetchGalleryImages, createGalleryImage, updateGalleryImage, deleteGalleryImage, type GalleryImage } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, X, Check, Loader2, Upload, Image as ImageIcon, Video } from 'lucide-react';

function isVideoUrl(url: string) {
  return url.startsWith('data:video/') || /\.(mp4|webm|mov|avi|mkv)(\?.*)?$/i.test(url);
}

const CATEGORIES = ['Goat', 'Poultry', 'Piggery', 'Crops', 'Farm'];

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    url: '',
    category: 'Farm',
    title: ''
  });

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    try {
      const data = await fetchGalleryImages();
      setImages(data);
    } catch (error) {
      console.error('Failed to load gallery images:', error);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setFormData({ url: '', category: 'Farm', title: '' });
    setEditingImage(null);
  };

  const handleOpenModal = (image?: GalleryImage) => {
    if (image) {
      setEditingImage(image);
      setFormData({
        url: image.url,
        category: image.category,
        title: image.title
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormData(prev => ({ ...prev, url: result }));
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

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      if (editingImage) {
        await updateGalleryImage({ id: editingImage.id, ...formData });
      } else {
        await createGalleryImage(formData);
      }
      setIsModalOpen(false);
      resetForm();
      await loadImages();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Operation failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await deleteGalleryImage(id);
      await loadImages();
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
          <span className="text-secondary text-[10px] font-bold tracking-[0.5em] uppercase block mb-4">Visual Archive</span>
          <h1 className="text-5xl font-serif font-bold text-primary tracking-tighter">Gallery</h1>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-premium flex items-center gap-2"
        >
          <Plus size={20} />
          Add Media
        </button>
      </div>

      {images.length === 0 ? (
        <div className="premium-card p-20 text-center space-y-6">
          <ImageIcon size={60} className="mx-auto text-primary/10" strokeWidth={1} />
          <p className="text-primary/40 font-serif italic text-xl">No media in the gallery yet.</p>
          <button onClick={() => handleOpenModal()} className="btn-premium">Add First Media</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <motion.div
              layout
              key={image.id}
              className="premium-card overflow-hidden group"
            >
                <div className="aspect-[4/3] overflow-hidden relative">
                  {isVideoUrl(image.url) ? (
                    <video src={image.url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={image.url} className="w-full h-full object-cover img-zoom" alt={image.title} />
                  )}
                  {isVideoUrl(image.url) && (
                    <div className="absolute top-3 right-3 bg-primary/80 backdrop-blur-sm rounded-full p-2">
                      <Video size={16} className="text-white" />
                    </div>
                  )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleOpenModal(image)}
                    className="flex-1 p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-wider"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="p-2 rounded-lg bg-red-500/80 backdrop-blur-sm text-white hover:bg-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-serif font-bold text-lg text-primary mb-1">{image.title}</h3>
                <span className="text-[10px] font-bold tracking-widest uppercase bg-primary/5 px-3 py-1 rounded-full text-primary/40">{image.category}</span>
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
                  {editingImage ? 'Edit Media' : 'Add Media'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-primary/40 hover:text-primary">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-grow">
                {/* Drag & Drop Upload */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                    dragActive ? 'border-secondary bg-secondary/5' : 'border-primary/10 hover:border-primary/30'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  {formData.url ? (
                    <div className="space-y-3">
                      {isVideoUrl(formData.url) ? (
                        <video src={formData.url} controls className="max-h-48 mx-auto rounded-xl" />
                      ) : (
                        <img src={formData.url} alt="Preview" className="max-h-48 mx-auto rounded-xl object-contain" />
                      )}
                      <p className="text-sm text-primary/60">Click to change file</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="mx-auto text-primary/30" size={40} />
                      <p className="text-primary/60 font-medium">Drag & drop an image or video here</p>
                      <p className="text-primary/30 text-sm">or click to browse</p>
                    </div>
                  )}
                </div>

                {/* Or paste URL */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-primary/40 ml-4">Or paste URL</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-cream p-4 rounded-2xl outline-none focus:ring-2 ring-secondary/20 transition-all text-sm font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-primary/40 ml-4">Title</label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Goat Herd Grazing"
                      className="w-full bg-cream p-4 rounded-2xl outline-none focus:ring-2 ring-secondary/20 transition-all font-serif"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-primary/40 ml-4">Category</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-cream p-4 rounded-2xl outline-none focus:ring-2 ring-secondary/20 transition-all"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    disabled={processing || !formData.url || !formData.title}
                    type="submit"
                    className="btn-premium w-full flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {processing ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Check size={20} />
                        {editingImage ? 'Update' : 'Add to Gallery'}
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
