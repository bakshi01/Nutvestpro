"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { Tag, X, Star, Search } from "lucide-react";
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

export default function AdminOffers() {
  const { navigate, isAdmin } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [comparePrice, setComparePrice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin) { navigate("/admin"); return; }
    fetchProducts();
  }, [isAdmin, navigate]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch {
      toast.error("Failed to fetch products");
    }
  }, []);

  const handleEditOffer = (product: Product) => {
    setEditProduct(product);
    setComparePrice(product.comparePrice?.toString() || "");
  };

  const handleSaveOffer = async () => {
    if (!editProduct) return;
    setLoading(true);
    try {
      const cp = comparePrice ? parseFloat(comparePrice) : null;
      if (cp && cp <= editProduct.price) {
        toast.error("Compare price must be greater than the selling price");
        setLoading(false);
        return;
      }
      const res = await fetch(`/api/products/${editProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editProduct.name,
          description: editProduct.description,
          price: editProduct.price,
          comparePrice: cp,
          category: editProduct.category,
          image: editProduct.image,
          weight: editProduct.weight,
          stock: editProduct.stock,
          featured: editProduct.featured,
          rating: editProduct.rating,
          reviews: editProduct.reviews,
        }),
      });
      if (res.ok) {
        toast.success(cp ? `Offer set for ${editProduct.name}` : `Offer removed from ${editProduct.name}`);
        setEditProduct(null);
        fetchProducts();
      } else {
        toast.error("Failed to update offer");
      }
    } catch {
      toast.error("Failed to save offer");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveOffer = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          price: product.price,
          comparePrice: null,
          category: product.category,
          image: product.image,
          weight: product.weight,
          stock: product.stock,
          featured: product.featured,
          rating: product.rating,
          reviews: product.reviews,
        }),
      });
      if (res.ok) {
        toast.success(`Offer removed from ${product.name}`);
        fetchProducts();
      }
    } catch {
      toast.error("Failed to remove offer");
    }
  };

  const filtered = products.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  const offerProducts = filtered.filter((p) => p.comparePrice && p.comparePrice > p.price);
  const regularProducts = filtered.filter((p) => !p.comparePrice || p.comparePrice <= p.price);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Offers <span className="gold-gradient">Management</span></h1>
            <p className="text-white/40 text-sm mt-1">Set compare prices to create offers. Products with compare prices appear on the Offers page.</p>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 font-bold">{offerProducts.length} active offers</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="glass-input w-full pl-10" />
        </div>

        {/* Active Offers */}
        {offerProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Tag className="w-5 h-5 text-amber-400" />Active Offers</h2>
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-white/40 text-xs font-medium py-3 px-4 uppercase tracking-wider">Product</th>
                      <th className="text-left text-white/40 text-xs font-medium py-3 px-4 uppercase tracking-wider">Price</th>
                      <th className="text-left text-white/40 text-xs font-medium py-3 px-4 uppercase tracking-wider">Compare Price</th>
                      <th className="text-left text-white/40 text-xs font-medium py-3 px-4 uppercase tracking-wider">Discount</th>
                      <th className="text-right text-white/40 text-xs font-medium py-3 px-4 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offerProducts.map((product) => {
                      const discount = product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;
                      return (
                        <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-cover bg-center shrink-0 ring-1 ring-white/10" style={{ backgroundImage: `url(${product.image})` }} />
                              <div className="min-w-0">
                                <p className="text-white font-medium text-sm truncate max-w-[180px]">{product.name}</p>
                                <p className="text-white/30 text-xs">{product.weight} | {product.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4"><span className="text-amber-400 font-medium text-sm">₹{product.price.toLocaleString()}</span></td>
                          <td className="py-3 px-4"><span className="text-white/50 text-sm line-through">₹{product.comparePrice?.toLocaleString()}</span></td>
                          <td className="py-3 px-4"><span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">{discount}% OFF</span></td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleEditOffer(product)} className="px-3 py-1.5 rounded-lg bg-amber-600/10 text-amber-400 hover:bg-amber-600/20 transition-colors text-xs font-medium">Edit</button>
                              <button onClick={() => handleRemoveOffer(product)} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-xs font-medium">Remove</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* All Products - Set Offers */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">All Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularProducts.map((product) => (
              <div key={product.id} className="glass-card p-4 flex items-center gap-3 group">
                <div className="w-14 h-14 rounded-lg bg-cover bg-center shrink-0 ring-1 ring-white/10" style={{ backgroundImage: `url(${product.image})` }} />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{product.name}</p>
                  <p className="text-white/40 text-xs">{product.category} | {product.weight}</p>
                  <p className="text-amber-400 text-sm font-bold">₹{product.price.toLocaleString()}</p>
                </div>
                <button onClick={() => handleEditOffer(product)} className="px-3 py-2 rounded-lg bg-amber-600/10 text-amber-400 hover:bg-amber-600/20 transition-colors text-xs font-semibold shrink-0">
                  Set Offer
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Offer Modal */}
      <AnimatePresence>
        {editProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setEditProduct(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="glass-card p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Set Offer for {editProduct.name}</h3>
                <button onClick={() => setEditProduct(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><X className="w-5 h-5 text-white/60" /></button>
              </div>

              <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-white/5">
                <div className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0 ring-1 ring-white/10" style={{ backgroundImage: `url(${editProduct.image})` }} />
                <div>
                  <p className="text-white font-medium">{editProduct.name}</p>
                  <p className="text-white/40 text-xs">{editProduct.weight} | {editProduct.category}</p>
                  <p className="text-amber-400 font-bold">Current Price: ₹{editProduct.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-white/60 text-sm mb-1.5 block font-medium">Compare / Original Price (₹)</label>
                  <input type="number" value={comparePrice} onChange={(e) => setComparePrice(e.target.value)} className="glass-input w-full" placeholder="e.g., 1299" min="0" step="1" />
                  <p className="text-white/30 text-xs mt-1.5">Set a price higher than ₹{editProduct.price.toLocaleString()} to show a discount. Leave empty to remove the offer.</p>
                </div>

                {comparePrice && parseFloat(comparePrice) > editProduct.price && (
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <p className="text-green-400 text-sm font-medium">
                      {Math.round(((parseFloat(comparePrice) - editProduct.price) / parseFloat(comparePrice)) * 100)}% OFF - Save ₹{(parseFloat(comparePrice) - editProduct.price).toLocaleString()}
                    </p>
                  </div>
                )}

                {comparePrice && parseFloat(comparePrice) <= editProduct.price && parseFloat(comparePrice) > 0 && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-red-400 text-sm font-medium">Compare price must be higher than selling price</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={handleSaveOffer} disabled={loading || (comparePrice !== "" && parseFloat(comparePrice) <= editProduct.price && parseFloat(comparePrice) > 0)} className="btn-primary flex-1 py-3 disabled:opacity-50">
                    {loading ? "Saving..." : "Save Offer"}
                  </button>
                  <button onClick={() => { setEditProduct(null); }} className="px-4 py-3 rounded-xl glass text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
