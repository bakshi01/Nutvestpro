"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { Camera, ArrowRight, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const galleryImages = [
  { src: "/products/almonds.jpg", title: "Premium Almonds", category: "Almonds", span: "row-span-2" },
  { src: "/products/cashews.jpg", title: "Golden Cashews", category: "Cashews", span: "" },
  { src: "/products/saffron.jpg", title: "Kashmiri Saffron", category: "Saffron", span: "" },
  { src: "/products/pistachios.jpg", title: "Green Pistachios", category: "Pistachios", span: "row-span-2" },
  { src: "/products/walnuts.jpg", title: "Kashmiri Walnuts", category: "Walnuts", span: "" },
  { src: "/products/raisins.jpg", title: "Sun-Dried Raisins", category: "Raisins", span: "" },
  { src: "/products/figs.jpg", title: "Afghan Figs", category: "Figs", span: "col-span-2" },
  { src: "/products/dates.jpg", title: "Medjool Dates", category: "Dates", span: "" },
  { src: "/products/apricots.jpg", title: "Dried Apricots", category: "Apricots", span: "" },
  { src: "/products/pinenuts.jpg", title: "Pine Nuts", category: "Pine Nuts", span: "" },
  { src: "/products/mixed.jpg", title: "Mixed Dry Fruits", category: "Mixed", span: "col-span-2" },
  { src: "/nuts-bg.jpg", title: "The NutVest Collection", category: "Collection", span: "" },
];

const categories = [
  "All",
  "Almonds",
  "Cashews",
  "Saffron",
  "Pistachios",
  "Walnuts",
  "Raisins",
  "Figs",
  "Dates",
  "Apricots",
  "Pine Nuts",
  "Mixed",
];

interface LightboxState {
  src: string;
  title: string;
  category: string;
}

export default function GalleryPage() {
  const { navigate } = useStore();
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === filter);

  const openLightbox = (img: (typeof galleryImages)[0]) => {
    setLightbox({ src: img.src, title: img.title, category: img.category });
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    if (!lightbox) return;
    const currentIndex = filtered.findIndex((img) => img.src === lightbox.src);
    if (currentIndex === -1) return;
    const newIndex =
      direction === "next"
        ? (currentIndex + 1) % filtered.length
        : (currentIndex - 1 + filtered.length) % filtered.length;
    const next = filtered[newIndex];
    setLightbox({ src: next.src, title: next.title, category: next.category });
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-amber-400 text-sm font-medium uppercase tracking-wider flex items-center justify-center gap-2">
              <Camera className="w-4 h-4" /> Our Gallery
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mt-3 mb-4">
              Product <span className="gold-gradient">Gallery</span>
            </h1>
            <p className="text-white/50 max-w-lg mx-auto">
              A visual journey through our premium collection of nuts and dry fruits
              from the valleys of Kashmir.
            </p>
          </motion.div>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === cat
                  ? "bg-amber-600/20 text-amber-400 border border-amber-500/30"
                  : "glass text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry-like Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] sm:auto-rows-[240px] gap-3 sm:gap-4">
          {filtered.map((image, index) => (
            <motion.div
              key={image.src + image.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(index * 0.04, 0.25) }}
              className={`glass-card overflow-hidden group cursor-pointer hover:border-amber-500/30 transition-all duration-300 relative ${image.span}`}
              onClick={() => openLightbox(image)}
            >
              <Image
                src={image.src}
                alt={image.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ZoomIn className="w-8 h-8 text-white/80 mb-2" />
                <p className="text-white font-semibold text-sm">{image.title}</p>
                <p className="text-amber-400 text-xs mt-0.5">{image.category}</p>
              </div>
              {/* Bottom label always visible */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white font-medium text-xs sm:text-sm truncate">{image.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <p className="text-white/50 mb-4 text-sm">
            Love what you see? Explore our full collection.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="btn-primary px-8 py-3 text-sm flex items-center gap-2 mx-auto"
          >
            Shop Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightbox && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8"
              onClick={() => setLightbox(null)}
            >
              {/* Close button */}
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Navigation arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox("prev");
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <span className="text-lg">&#8249;</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox("next");
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <span className="text-lg">&#8250;</span>
              </button>

              {/* Image container */}
              <motion.div
                key={lightbox.src}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative max-w-4xl w-full max-h-[85vh] aspect-square"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={lightbox.src}
                  alt={lightbox.title}
                  fill
                  className="object-contain rounded-2xl"
                  sizes="(max-width: 768px) 100vw, 896px"
                />
                {/* Caption */}
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <p className="text-white font-semibold">{lightbox.title}</p>
                  <p className="text-amber-400 text-sm">{lightbox.category}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
