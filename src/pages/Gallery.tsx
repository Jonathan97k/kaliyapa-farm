import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchGalleryImages, type GalleryImage } from '../lib/api';
import { Link } from 'react-router-dom';
import { X, Camera, Loader2, Video } from 'lucide-react';
import SEO from '../components/SEO';

function isVideoUrl(url: string) {
  return url.startsWith('data:video/') || /\.(mp4|webm|mov|avi|mkv)(\?.*)?$/i.test(url);
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState<{ url: string; title: string; category: string } | null>(null);

  useEffect(() => {
    async function loadImages() {
      try {
        const data = await fetchGalleryImages();
        setImages(data);
      } catch (error) {
        console.error('Failed to load gallery:', error);
      } finally {
        setLoading(false);
      }
    }
    loadImages();
  }, []);

  const categories = ['All', ...Array.from(new Set(images.map(img => img.category)))];
  const filteredImages = filter === 'All' ? images : images.filter(img => img.category === filter);

  if (loading) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-secondary" size={48} />
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <SEO
        title="Photo Gallery - Farm Life & Livestock"
        description="Browse our curated gallery showcasing goat, poultry, piggery, and crop farming operations at Kaliyapa Farmstead in Salima, Malawi."
        keywords="farm gallery, livestock photos, goat farming images, poultry farm, piggery Malawi, agricultural photography"
        canonicalUrl="https://kaliyapafarmstead.com/gallery"
      />
      {/* Header */}
      <section className="pt-32 md:pt-40 lg:pt-48 pb-16 md:pb-24 px-4 bg-primary text-white overflow-hidden relative text-center">
        <div className="grain-overlay opacity-10" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-badge mb-8 md:mb-12"
          >
            <Camera className="h-3 w-3" /> Visual Archive
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold leading-[0.9] tracking-tighter mb-6 md:mb-8"
          >
            Capture <br/> <span className="italic text-secondary">the Harvest.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base md:text-lg text-white/50 font-light italic font-serif max-w-2xl mx-auto"
          >
            A curated collection showcasing the rhythm, beauty, and dedication behind Kaliyapa Farmstead.
          </motion.p>

          {/* Custom Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-12 md:mt-16">
            {categories.map((cat) => {
              const count = cat === 'All' ? images.length : images.filter(i => i.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`group px-5 md:px-8 py-2.5 md:py-3 rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase transition-all duration-500 border flex items-center gap-2 ${
                    filter === cat
                      ? 'bg-secondary border-secondary text-primary shadow-xl shadow-secondary/30'
                      : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {cat}
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${filter === cat ? 'bg-primary/10' : 'bg-white/5'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Grid - Masonry style */}
      <section className="py-16 md:py-24 px-4 max-w-screen-2xl mx-auto">
        <motion.div
          layout
          className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, i) => (
              <motion.div
                key={image.id || image.url}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                onClick={() => setLightbox({ url: image.url, title: image.title, category: image.category })}
                className="premium-card group break-inside-avoid relative cursor-pointer"
              >
                <div className="overflow-hidden relative">
                  {isVideoUrl(image.url) ? (
                    <video
                      src={image.url}
                      className="w-full h-auto"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-auto img-zoom"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  )}
                  {isVideoUrl(image.url) && (
                    <div className="absolute top-3 right-3 bg-primary/80 backdrop-blur-sm rounded-full p-2">
                      <Video size={16} className="text-white" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 md:p-8">
                    <div className="text-secondary text-[10px] font-bold tracking-[0.3em] uppercase mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{image.category}</div>
                    <h3 className="text-white text-lg md:text-xl font-serif font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 mb-3">{image.title}</h3>
                    <div className="text-white/60 text-[10px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150 flex items-center gap-2">
                      {isVideoUrl(image.url) ? <Video className="h-3 w-3" /> : <Camera className="h-3 w-3" />} Click to expand
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredImages.length === 0 && (
          <div className="text-center py-20 text-primary/40">
            <p className="text-lg font-serif italic">No images in this category yet.</p>
          </div>
        )}
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[200] bg-primary/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12 cursor-pointer"
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl max-h-[90vh] relative cursor-default"
            >
              {isVideoUrl(lightbox.url) ? (
                <video
                  src={lightbox.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl"
                />
              ) : (
                <img
                  src={lightbox.url}
                  alt={lightbox.title}
                  className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                />
              )}
              <div className="text-center mt-6">
                <div className="text-secondary text-[10px] font-bold tracking-[0.3em] uppercase mb-2">{lightbox.category}</div>
                <h3 className="text-white text-2xl md:text-3xl font-serif font-bold">{lightbox.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* End section */}
      <section className="py-20 md:py-32 lg:py-40 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="section-label justify-center mb-8">Connect With Us</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary mb-8 md:mb-12 mt-6">The proof is in the <span className="italic text-secondary">production.</span></h2>
          <Link to="/contact" className="btn-premium">Inquire About Our Stock</Link>
        </div>
      </section>
    </div>
  );
}
