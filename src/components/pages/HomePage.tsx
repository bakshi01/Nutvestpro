"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShoppingCart,
  ArrowRight,
  Shield,
  Truck,
  Award,
  Leaf,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice: number | null;
  category: string;
  image: string;
  weight: string;
  stock: number;
  featured: boolean;
  rating: number;
  reviews: number;
}

const categories = [
  { name: "Almonds", slug: "Almonds", image: "/products/almonds.jpg", desc: "Kashmiri premium almonds" },
  { name: "Cashews", slug: "Cashews", image: "/products/cashews.jpg", desc: "Whole & broken cashews" },
  { name: "Saffron", slug: "Saffron", image: "/products/saffron.jpg", desc: "Pure Kashmiri saffron" },
  { name: "Pistachios", slug: "Pistachios", image: "/products/pistachios.jpg", desc: "Salted & unsalted" },
  { name: "Walnuts", slug: "Walnuts", image: "/products/walnuts.jpg", desc: "Kashmiri walnuts" },
  { name: "Dates", slug: "Dates", image: "/products/dates.jpg", desc: "Premium Medjool dates" },
  { name: "Raisins", slug: "Raisins", image: "/products/raisins.jpg", desc: "Golden & green raisins" },
  { name: "Figs", slug: "Figs", image: "/products/figs.jpg", desc: "Dried premium figs" },
  { name: "Pine Nuts", slug: "Pine Nuts", image: "/products/pinenuts.jpg", desc: "Kashmiri pine nuts" },
  { name: "Apricots", slug: "Apricots", image: "/products/apricots.jpg", desc: "Dried sweet apricots" },
  { name: "Mixed Dry Fruits", slug: "Mixed", image: "/products/mixed.jpg", desc: "Premium mixed assortment" },
];

const videoSlides = [
  { src: "/videos/nuts-harvest.mp4", title: "In The Spotlight", subtitle: "Harvested from the valleys of Kashmir" },
  { src: "/videos/nuts-processing.mp4", title: "Crafted With Care", subtitle: "Every nut carefully processed by hand" },
  { src: "/videos/nuts-quality.mp4", title: "Premium Quality", subtitle: "Rigorous quality checks at every step" },
  { src: "/videos/nuts-packaging.mp4", title: "Sealed Fresh", subtitle: "Packaged to preserve nature's goodness" },
  { src: "/videos/kashmir-nuts.mp4", title: "From Kashmir To You", subtitle: "Authentic Kashmiri dry fruits delivered fresh" },
];

const testimonials = [
  { name: "Rahul Sharma", text: "The best almonds I have ever tasted. NutVest delivers true premium quality with excellent packaging and timely delivery.", rating: 5, location: "Mumbai" },
  { name: "Priya Patel", text: "Ordered the Kashmiri Saffron and it was absolutely authentic and fragrant. The quality speaks for itself. Will order again!", rating: 5, location: "Ahmedabad" },
  { name: "Amit Kumar", text: "Great packaging, fresh products, and fast delivery. The walnut kernels are of exceptional quality. Highly recommended!", rating: 5, location: "Delhi" },
];

function OrderNowDialog({ product, onClose }: { product: Product; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    if (!form.address.trim()) errs.address = "Address is required";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const message = `*NutVest Order*\n\nProduct: ${product.name}\nWeight: ${product.weight}\nPrice: ₹${product.price.toLocaleString()}\n\nName: ${form.name}\nPhone: ${form.phone}\nAddress: ${form.address}\n\nPlease confirm my order!`;
    window.open(`https://wa.me/918899697765?text=${encodeURIComponent(message)}`, "_blank");
    onClose();
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Order {product.name}</h3>
          <button onClick={onClose} aria-label="Close dialog" className="p-1 hover:bg-white/10 rounded-lg text-white/40">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white/60 text-sm mb-1 block">Full Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="glass-input" placeholder="Enter your name" />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1 block">Phone Number *</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="glass-input" placeholder="+91 98765 43210" />
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1 block">Delivery Address *</label>
            <textarea value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} className="glass-input min-h-[80px] resize-none" placeholder="Full address with pin code" rows={3} />
            {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
          </div>
          <button type="submit" className="btn-whatsapp w-full py-3"><MessageCircle className="w-5 h-5" />Order via WhatsApp</button>
        </form>
      </div>
    </div>
  );
}

function ProductCard({ product, onOrder }: { product: Product; onOrder: (p: Product) => void }) {
  const { navigate, addToCart } = useStore();

  const handleAddToCart = () => {
    addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image, weight: product.weight });
  };

  return (
    <div className="glass-card glass-card-hover group transition-all duration-300 flex flex-col">
      <div className="product-card-image cursor-pointer" style={{ backgroundImage: `url(${product.image})` }} onClick={() => navigate(`/product/${product.id}`)}>
        {product.comparePrice && (
          <span className="absolute top-3 left-3 z-10 px-2 py-1 bg-red-500/90 text-white text-xs font-bold rounded-md">
            {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 z-10 px-2 py-1 bg-gray-600/90 text-white text-xs font-bold rounded-md">Out of Stock</span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <button onClick={() => navigate(`/product/${product.id}`)} className="text-left mb-1">
          <h3 className="text-white font-semibold text-sm group-hover:text-amber-400 transition-colors line-clamp-1">{product.name}</h3>
        </button>
        <p className="text-white/40 text-xs mb-2">{product.weight} | {product.category}</p>
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-white/20"}`} />
          ))}
          <span className="text-white/40 text-xs ml-1">({product.reviews})</span>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-amber-400">₹{product.price.toLocaleString()}</span>
          {product.comparePrice && <span className="text-xs text-white/30 line-through">₹{product.comparePrice.toLocaleString()}</span>}
        </div>
        <div className="mt-auto flex gap-2">
          <button onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1 py-2 px-3 rounded-lg bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 transition-colors text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed">
            <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
          </button>
          <button onClick={() => onOrder(product)} disabled={product.stock === 0} className="flex-1 py-2 px-3 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed">
            <MessageCircle className="w-3.5 h-3.5" /> Order Now
          </button>
        </div>
      </div>
    </div>
  );
}

/* Hero Section with Background Image */
function HeroSection() {
  const { navigate } = useStore();

  return (
    <section className="hero-bg-section">
      {/* Background Image */}
      <div className="hero-bg-image" />

      {/* Dark Overlay */}
      <div className="hero-bg-overlay" />

      {/* Content */}
      <div className="hero-bg-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <span className="inline-block text-amber-400 text-xs sm:text-sm font-medium uppercase tracking-[0.25em] mb-4 sm:mb-6">From the Valleys of Kashmir</span>
          <h1 className="hero-bg-title">
            Premium <span className="gold-gradient">Nuts</span> &<br />Dry <span className="gold-gradient">Fruits</span>
          </h1>
          <p className="hero-bg-subtitle">
            Handpicked, 100% natural Kashmiri dry fruits delivered fresh to your doorstep.
            Authenticity guaranteed with every bite.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <button onClick={() => navigate("/products")} className="btn-primary px-8 py-3.5 text-sm sm:text-base">
              Shop Now <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate("/about")} className="hero-bg-cta-secondary px-8 py-3.5 text-sm sm:text-base">
              Our Story
            </button>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center gap-6 sm:gap-10 mt-10 sm:mt-14"
        >
          <div className="text-center">
            <p className="text-amber-400 text-xl sm:text-2xl font-bold">100%</p>
            <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider mt-0.5">Natural</p>
          </div>
          <div className="w-px h-8 bg-white/15" />
          <div className="text-center">
            <p className="text-amber-400 text-xl sm:text-2xl font-bold">5000+</p>
            <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider mt-0.5">Happy Customers</p>
          </div>
          <div className="w-px h-8 bg-white/15" />
          <div className="text-center">
            <p className="text-amber-400 text-xl sm:text-2xl font-bold">Free</p>
            <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider mt-0.5">Delivery Above ₹999</p>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-2.5 rounded-full bg-amber-400/80" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* Full-Screen Video Hero Slideshow with fade transitions */
function VideoHeroSlideshow() {
  const { navigate } = useStore();
  const [current, setCurrent] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % videoSlides.length);
    }, 6000);
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startAutoplay]);

  // Play current video, pause others
  useEffect(() => {
    videoRefs.current.forEach((ref, i) => {
      if (ref) {
        if (i === current) {
          ref.currentTime = 0;
          ref.play().catch(() => {});
        } else {
          ref.pause();
        }
      }
    });
  }, [current]);

  const goTo = (index: number) => {
    setCurrent(index);
    startAutoplay();
  };

  return (
    <section className="video-hero-section">
      {/* Video Slides */}
      {videoSlides.map((slide, i) => (
        <div key={i} className={`video-section-slide ${i === current ? "active" : ""}`}>
          <video
            ref={(el) => { videoRefs.current[i] = el; }}
            src={slide.src}
            loop
            muted
            playsInline
            preload={i === 0 ? "auto" : "metadata"}
          />
        </div>
      ))}

      {/* Dark overlay gradient */}
      <div className="video-section-overlay" />

      {/* Center Content */}
      <div className="video-section-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="video-section-title">{videoSlides[current].title}</h2>
            <p className="video-section-subtitle">{videoSlides[current].subtitle}</p>
            <button onClick={() => navigate("/products")} className="video-hero-cta">
              Explore <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="video-section-dots">
        {videoSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`video-hero-dot ${i === current ? "active" : ""}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const { navigate } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("/api/products?featured=true").then((res) => res.json()).then(setProducts).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      {orderProduct && <OrderNowDialog product={orderProduct} onClose={() => setOrderProduct(null)} />}

      {/* Hero Section with Background Image */}
      <HeroSection />

      {/* Video Slideshow Section */}
      <section className="py-16 sm:py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Our Journey</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-3">From <span className="gold-gradient">Kashmir</span> To You</h2>
            <p className="text-white/50 max-w-lg mx-auto text-sm">Experience the journey of our premium dry fruits — from harvest to your doorstep</p>
          </div>
        </div>
      </section>
      <VideoHeroSlideshow />

      {/* Featured Products */}
      <section className="py-16 sm:py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Bestsellers</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-3">Featured <span className="gold-gradient">Products</span></h2>
            <p className="text-white/50 max-w-lg mx-auto">Handpicked premium selections loved by our customers</p>
          </div>
          {products.length === 0 ? (
            <div className="text-center text-white/40 py-12">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 6).map((product, index) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <ProductCard product={product} onOrder={setOrderProduct} />
                </motion.div>
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <button onClick={() => navigate("/products")} className="btn-primary px-8 py-3">View All Products <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Browse By Type</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-3">Shop By <span className="gold-gradient">Category</span></h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat, index) => (
              <motion.button key={cat.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.03 }} onClick={() => navigate(`/category/${cat.slug}`)} className="glass-card glass-card-hover p-4 text-left group transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-cover bg-center mb-3 ring-1 ring-white/10" style={{ backgroundImage: `url(${cat.image})` }} />
                <h3 className="text-white font-semibold text-sm group-hover:text-amber-400 transition-colors">{cat.name}</h3>
                <p className="text-white/40 text-xs mt-0.5">{cat.desc}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 sm:py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Why NutVest</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-3">Why Choose <span className="gold-gradient">Us</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, title: "Premium Quality", desc: "Every product is sourced from the finest farms and rigorously quality-checked to ensure you receive only the best." },
              { icon: Leaf, title: "100% Natural", desc: "No preservatives, no additives, no artificial flavors. Just pure, natural nuts and dry fruits as nature intended." },
              { icon: Truck, title: "Fast Delivery", desc: "Fresh products delivered to your doorstep within 3-5 business days with secure packaging across India." },
              { icon: Shield, title: "Authenticity Guaranteed", desc: "Guaranteed authentic Kashmiri products with quality certification. Your trust is our priority." },
            ].map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="glass-card p-6 text-center group glass-card-hover transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-amber-600/15 flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-600/25 transition-colors">
                  <item.icon className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Owner Section */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            <div className="shrink-0">
              <Image src="/owner.jpg" alt="Mohammad Sayeed - Owner of NutVest" width={160} height={160} className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover ring-2 ring-amber-600/30" priority />
            </div>
            <div>
              <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Meet the Founder</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 mb-3">Mohammad Sayeed</h2>
              <p className="text-white/60 leading-relaxed mb-4">Born and raised in the beautiful valley of Bandipora, Kashmir, Mohammad Sayeed founded NutVest with a simple mission: to bring the authentic taste of Kashmiri nuts and dry fruits to every home in India. With deep roots in the local farming community and years of expertise in premium dry fruit sourcing, he ensures every product meets the highest standards of quality and freshness.</p>
              <p className="text-white/50 text-sm italic">&ldquo;Our commitment is not just to sell nuts, but to deliver the heritage and purity of Kashmir to your doorstep.&rdquo;</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Customer Love</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-3">What Our <span className="gold-gradient">Customers Say</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="glass-card p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(t.rating)].map((_, i) => (<Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white font-bold text-sm">{t.name[0]}</div>
                  <div>
                    <p className="text-white font-medium text-sm">{t.name}</p>
                    <p className="text-white/40 text-xs">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-card p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Stay <span className="gold-gradient">Updated</span></h2>
            <p className="text-white/50 mb-6">Subscribe for exclusive deals, new arrivals, and health tips delivered to your inbox.</p>
            <form onSubmit={(e) => { e.preventDefault(); toast.success("Subscribed! You'll hear from us soon."); setEmail(""); }} className="flex flex-col sm:flex-row gap-3">
              <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="glass-input flex-1 px-4 py-3" required />
              <button type="submit" className="btn-primary px-6 py-3 whitespace-nowrap">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
