"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Star, ShoppingCart, Minus, Plus, MessageCircle,
  Truck, Shield, Award, Home, ChevronRight,
} from "lucide-react";
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

export default function ProductDetailPage({ productId }: { productId: string }) {
  const { navigate, addToCart } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", address: "" });
  const [orderErrors, setOrderErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        fetch(`/api/products?category=${data.category}`)
          .then((r) => r.json())
          .then((prods) => setRelated(prods.filter((p: Product) => p.id !== data.id).slice(0, 4)))
          .catch(() => {});
      })
      .catch(() => {});
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ id: product.id, name: product.name, price: product.price, quantity, image: product.image, weight: product.weight });
    toast.success(`${product.name} added to cart!`);
  };

  const handleOrderNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    const errs: Record<string, string> = {};
    if (!orderForm.name.trim()) errs.name = "Name is required";
    if (!orderForm.phone.trim()) errs.phone = "Phone is required";
    if (!orderForm.address.trim()) errs.address = "Address is required";
    if (Object.keys(errs).length > 0) { setOrderErrors(errs); return; }

    const message = `*NutVest Order*\n\nProduct: ${product.name}\nWeight: ${product.weight}\nQuantity: ${quantity}\nPrice: ₹${product.price.toLocaleString()} each\nTotal: ₹${(product.price * quantity).toLocaleString()}\n\nName: ${orderForm.name}\nPhone: ${orderForm.phone}\nAddress: ${orderForm.address}\n\nPlease confirm my order!`;
    window.open(`https://wa.me/918899697765?text=${encodeURIComponent(message)}`, "_blank");
    setShowOrderForm(false);
    setOrderForm({ name: "", phone: "", address: "" });
  };

  if (!product) {
    return <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4 flex items-center justify-center"><div className="text-white/40">Loading product...</div></div>;
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/40 mb-6 flex-wrap">
          <button onClick={() => navigate("/")} className="hover:text-amber-400 transition-colors flex items-center gap-1"><Home className="w-3.5 h-3.5" /> Home</button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={() => navigate("/products")} className="hover:text-amber-400 transition-colors">Products</button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={() => navigate(`/category/${product.category}`)} className="hover:text-amber-400 transition-colors">{product.category}</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-amber-400 truncate max-w-[150px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card overflow-hidden">
            <div className="h-72 sm:h-96 lg:h-[500px] bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }} />
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <span className="text-amber-400 text-sm font-medium uppercase tracking-wider mb-2">{product.category}</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-white/20"}`} />
                ))}
              </div>
              <span className="text-white/50 text-sm">{product.rating} ({product.reviews} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-amber-400">₹{product.price.toLocaleString()}</span>
              {product.comparePrice && (
                <>
                  <span className="text-lg text-white/30 line-through">₹{product.comparePrice.toLocaleString()}</span>
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-lg">
                    {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-white/60 leading-relaxed mb-6">{product.description}</p>

            <div className="glass-card p-4 mb-6 space-y-3">
              <div className="flex justify-between text-sm"><span className="text-white/50">Weight</span><span className="text-white font-medium">{product.weight}</span></div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Availability</span>
                <span className={`font-medium ${product.stock > 10 ? "text-green-400" : product.stock > 0 ? "text-orange-400" : "text-red-400"}`}>
                  {product.stock > 10 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left` : "Out of Stock"}
                </span>
              </div>
              <div className="flex justify-between text-sm"><span className="text-white/50">Category</span><span className="text-white font-medium">{product.category}</span></div>
              <div className="flex justify-between text-sm"><span className="text-white/50">Origin</span><span className="text-white font-medium">Kashmir, India</span></div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-white/50 text-sm">Quantity</span>
              <div className="flex items-center gap-2 glass rounded-xl px-2 py-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Minus className="w-4 h-4 text-white" /></button>
                <span className="w-10 text-center text-white font-medium">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Plus className="w-4 h-4 text-white" /></button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn-primary flex-1 py-3.5 disabled:opacity-40 disabled:cursor-not-allowed">
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
              <button onClick={() => setShowOrderForm(true)} disabled={product.stock === 0} className="btn-whatsapp flex-1 py-3.5 disabled:opacity-40 disabled:cursor-not-allowed">
                <MessageCircle className="w-5 h-5" /> Order Now
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: "Fast Delivery" },
                { icon: Shield, label: "Authentic" },
                { icon: Award, label: "Premium" },
              ].map((b) => (
                <div key={b.label} className="glass rounded-xl p-3 text-center">
                  <b.icon className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  <span className="text-white/50 text-xs">{b.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">Related <span className="gold-gradient">Products</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <div key={p.id} className="glass-card glass-card-hover overflow-hidden group cursor-pointer transition-all" onClick={() => navigate(`/product/${p.id}`)}>
                  <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${p.image})` }} />
                  <div className="p-4">
                    <h3 className="text-white font-medium text-sm group-hover:text-amber-400 transition-colors">{p.name}</h3>
                    <p className="text-amber-400 font-bold mt-1">₹{p.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Order Now Dialog */}
      {showOrderForm && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowOrderForm(false)}>
          <div className="glass-card p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Order {product.name}</h3>
              <button onClick={() => setShowOrderForm(false)} aria-label="Close dialog" className="p-1 hover:bg-white/10 rounded-lg text-white/40">✕</button>
            </div>
            <p className="text-white/50 text-sm mb-4">Qty: {quantity} | Total: ₹{(product.price * quantity).toLocaleString()}</p>
            <form onSubmit={handleOrderNow} className="space-y-4">
              <div>
                <label className="text-white/60 text-sm mb-1 block">Full Name *</label>
                <input type="text" value={orderForm.name} onChange={(e) => setOrderForm({...orderForm, name: e.target.value})} className="glass-input" placeholder="Enter your name" />
                {orderErrors.name && <p className="text-red-400 text-xs mt-1">{orderErrors.name}</p>}
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1 block">Phone Number *</label>
                <input type="tel" value={orderForm.phone} onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})} className="glass-input" placeholder="+91 98765 43210" />
                {orderErrors.phone && <p className="text-red-400 text-xs mt-1">{orderErrors.phone}</p>}
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1 block">Delivery Address *</label>
                <textarea value={orderForm.address} onChange={(e) => setOrderForm({...orderForm, address: e.target.value})} className="glass-input min-h-[80px] resize-none" placeholder="Full address with pin code" rows={3} />
                {orderErrors.address && <p className="text-red-400 text-xs mt-1">{orderErrors.address}</p>}
              </div>
              <button type="submit" className="btn-whatsapp w-full py-3"><MessageCircle className="w-5 h-5" />Order via WhatsApp</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
