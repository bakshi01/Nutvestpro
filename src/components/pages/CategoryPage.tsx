"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Star, ShoppingCart, MessageCircle, ChevronRight, Home } from "lucide-react";

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

const categoryMeta: Record<string, { desc: string; longDesc: string }> = {
  Almonds: { desc: "Kashmiri Premium Almonds", longDesc: "Sourced directly from the orchards of Kashmir, our almonds are known for their rich flavor, crunchy texture, and high nutritional value. Perfect for snacking, cooking, or making traditional Kashmiri dishes." },
  Cashews: { desc: "Whole & Premium Cashews", longDesc: "Our cashews are carefully selected for their size, creaminess, and taste. Ideal for both snacking and cooking, these premium cashews deliver a buttery smooth flavor." },
  Walnuts: { desc: "Kashmiri Walnut Kernels", longDesc: "Kashmir is famous for its walnuts, and ours are the finest. Rich in omega-3 fatty acids and antioxidants, these walnut kernels are a healthy and delicious choice." },
  Pistachios: { desc: "Premium Quality Pistachios", longDesc: "Our pistachios are sourced from the best farms, naturally opened and perfectly roasted. A gourmet snack that combines taste with health benefits." },
  Saffron: { desc: "Pure Kashmiri Saffron", longDesc: "Kashmiri saffron is among the most prized spices in the world. Our saffron is 100% pure, hand-harvested from the crocus flowers of the Kashmir valley, with an intense aroma and deep color." },
  Raisins: { desc: "Golden & Green Raisins", longDesc: "Sweet, plump, and naturally dried, our raisins come in golden and green varieties. A healthy snack and a versatile ingredient for desserts and savory dishes alike." },
  Figs: { desc: "Dried Premium Figs", longDesc: "Our dried figs are naturally sweet with a soft, chewy texture. Packed with fiber, vitamins, and minerals, they make a perfect healthy snack." },
  "Pine Nuts": { desc: "Kashmiri Pine Nuts (Chilgoza)", longDesc: "Pine nuts from the Kashmir valley are a rare delicacy. Known locally as Chilgoza, these nuts have a delicate, buttery flavor and are rich in healthy fats and protein." },
  Dates: { desc: "Premium Medjool Dates", longDesc: "Our premium dates are naturally sweet with a caramel-like flavor and soft texture. Perfect for breaking fasts, healthy snacking, or adding natural sweetness to recipes." },
  Apricots: { desc: "Dried Sweet Apricots", longDesc: "Kashmiri dried apricots are sweet, tangy, and full of flavor. A traditional snack from the valley, they are rich in iron and make a great addition to trail mixes." },
  Mixed: { desc: "Premium Mixed Dry Fruits", longDesc: "Our mixed dry fruits assortment brings together the best of Kashmir in one pack. A perfect gift for any occasion, combining almonds, cashews, pistachios, raisins, and more." },
};

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

export default function CategoryPage({ categoryName }: { categoryName: string }) {
  const { navigate, addToCart } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch(`/api/products?category=${encodeURIComponent(categoryName)}`)
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => {});
  }, [categoryName]);

  const meta = categoryMeta[categoryName] || { desc: "Premium Dry Fruits", longDesc: "Explore our premium collection." };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4">
      {orderProduct && <OrderNowDialog product={orderProduct} onClose={() => setOrderProduct(null)} />}

      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/40 mb-6 flex-wrap">
          <button onClick={() => navigate("/")} className="hover:text-amber-400 transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" /> Home
          </button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={() => navigate("/products")} className="hover:text-amber-400 transition-colors">Products</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-amber-400">{categoryName}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {categoryName} <span className="gold-gradient">Collection</span>
          </h1>
          <p className="text-amber-400/70 text-sm font-medium mb-2">{meta.desc}</p>
          <p className="text-white/50 max-w-2xl">{meta.longDesc}</p>
        </div>

        <p className="text-white/40 text-sm mb-4">{products.length} product{products.length !== 1 ? "s" : ""}</p>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/40 text-lg">No products in this category yet.</p>
            <button onClick={() => navigate("/products")} className="mt-4 btn-primary px-6 py-2.5 text-sm">Browse All Products</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product, index) => (
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
                      onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image, weight: product.weight })}
                      disabled={product.stock === 0}
                      className="flex-1 py-2 px-3 rounded-lg bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 transition-colors text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                    </button>
                    <button
                      onClick={() => setOrderProduct(product)}
                      disabled={product.stock === 0}
                      className="flex-1 py-2 px-3 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Order Now
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
