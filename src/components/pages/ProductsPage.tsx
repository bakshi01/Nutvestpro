"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingCart,
  SlidersHorizontal,
  X,
  MessageCircle,
} from "lucide-react";

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

const allCategories = [
  "All", "Almonds", "Cashews", "Walnuts", "Pistachios", "Saffron",
  "Raisins", "Figs", "Pine Nuts", "Mixed", "Apricots", "Dates",
];

type SortOption = "newest" | "price-asc" | "price-desc" | "name-asc" | "rating";

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
          <button type="submit" className="btn-whatsapp w-full py-3">
            <MessageCircle className="w-5 h-5" />
            Order via WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const { navigate, addToCart } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];
    if (category !== "All") result = result.filter((p) => p.category === category);
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sort) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "name-asc": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
    }
    return result;
  }, [products, category, sort, priceRange]);

  const handleAddToCart = (product: Product) => {
    addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image, weight: product.weight });
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4">
      {orderProduct && <OrderNowDialog product={orderProduct} onClose={() => setOrderProduct(null)} />}

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Our <span className="gold-gradient">Products</span>
          </h1>
          <p className="text-white/50">Explore our premium collection of nuts and dry fruits</p>
        </div>

        {/* Sort & Filter Bar */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="glass-input px-4 py-2.5 appearance-none cursor-pointer w-auto text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="rating">Top Rated</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2.5 rounded-lg glass text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          <span className="text-white/40 text-sm ml-auto">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat
                  ? "bg-amber-600/20 text-amber-400 border border-amber-500/30"
                  : "glass text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Price filter */}
        {showFilters && (
          <div className="glass-card p-4 mb-6">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-white/60 text-sm">Price Range:</span>
              <input type="range" min={0} max={5000} step={100} value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} className="flex-1 max-w-xs" />
              <span className="text-amber-400 text-sm font-medium">₹{priceRange[0].toLocaleString()} — ₹{priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/40 text-lg">No products found matching your criteria.</p>
            <button onClick={() => { setCategory("All"); setPriceRange([0, 5000]); }} className="mt-4 text-amber-400 hover:text-amber-300 text-sm underline">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.3) }}
                className="glass-card glass-card-hover group transition-all duration-300 flex flex-col"
              >
                <div
                  className="product-card-image cursor-pointer"
                  style={{ backgroundImage: `url(${product.image})` }}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {product.comparePrice && (
                    <span className="absolute top-3 left-3 z-10 px-2 py-1 bg-red-500/90 text-white text-xs font-bold rounded-md">
                      {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                    </span>
                  )}
                  {product.stock < 10 && product.stock > 0 && (
                    <span className="absolute top-3 right-3 z-10 px-2 py-1 bg-orange-500/90 text-white text-xs font-bold rounded-md">Low Stock</span>
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
                    {product.comparePrice && (
                      <span className="text-xs text-white/30 line-through">₹{product.comparePrice.toLocaleString()}</span>
                    )}
                  </div>
                  <div className="mt-auto flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="flex-1 py-2 px-3 rounded-lg bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 transition-colors text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => setOrderProduct(product)}
                      disabled={product.stock === 0}
                      className="flex-1 py-2 px-3 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Order Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
