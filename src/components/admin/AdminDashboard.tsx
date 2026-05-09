"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import {
  Package,
  Tag,
  ArrowRight,
  ShoppingBag,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function AdminDashboard() {
  const { navigate, isAdmin } = useStore();
  const [stats, setStats] = useState({ totalProducts: 0, offerProducts: 0, categories: 0 });

  useEffect(() => {
    if (!isAdmin) { navigate("/admin"); return; }
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const uniqueCategories = new Set(data.map((p: { category: string }) => p.category));
        setStats({
          totalProducts: data.length,
          offerProducts: data.filter((p: { comparePrice: number | null; price: number }) => p.comparePrice && p.comparePrice > p.price).length,
          categories: uniqueCategories.size,
        });
      })
      .catch(() => {});
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome back, <span className="gold-gradient">Sayeed</span></h1>
            <p className="text-white/40 text-sm mt-1">Manage your NutVest store from here</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-blue-400/10 flex items-center justify-center"><Package className="w-4 h-4 text-blue-400" /></div>
            </div>
            <p className="text-white font-bold text-2xl">{stats.totalProducts}</p>
            <p className="text-white/40 text-xs mt-0.5">Total Products</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-amber-400/10 flex items-center justify-center"><Tag className="w-4 h-4 text-amber-400" /></div>
            </div>
            <p className="text-white font-bold text-2xl">{stats.offerProducts}</p>
            <p className="text-white/40 text-xs mt-0.5">Active Offers</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-green-400/10 flex items-center justify-center"><TrendingUp className="w-4 h-4 text-green-400" /></div>
            </div>
            <p className="text-white font-bold text-2xl">{stats.categories}</p>
            <p className="text-white/40 text-xs mt-0.5">Categories</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4 flex items-center gap-2"><Clock className="w-3.5 h-3.5" />Quick Actions</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} onClick={() => navigate("/admin/products")} className="glass-card p-6 text-left group hover:border-amber-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-400/10 flex items-center justify-center group-hover:bg-blue-400/15 transition-colors"><Package className="w-6 h-6 text-blue-400" /></div>
              <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Manage Products</h3>
            <p className="text-white/50 text-sm">Add new products, edit existing ones, or remove products from your catalog</p>
            <div className="mt-3 flex items-center gap-4 text-xs text-white/30">
              <span>Add Products</span>
              <span>Edit Products</span>
              <span>Remove Products</span>
            </div>
          </motion.button>

          <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} onClick={() => navigate("/admin/offers")} className="glass-card p-6 text-left group hover:border-amber-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center group-hover:bg-amber-400/15 transition-colors"><Tag className="w-6 h-6 text-amber-400" /></div>
              <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Manage Offers</h3>
            <p className="text-white/50 text-sm">Set discount prices, create offers, and control which products appear on the offers page</p>
            <div className="mt-3 flex items-center gap-4 text-xs text-white/30">
              <span>Set Discounts</span>
              <span>Remove Offers</span>
              <span>{stats.offerProducts} Active</span>
            </div>
          </motion.button>

          <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} onClick={() => navigate("/")} className="glass-card p-6 text-left group hover:border-amber-500/30 transition-all sm:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-400/10 flex items-center justify-center group-hover:bg-green-400/15 transition-colors"><ShoppingBag className="w-6 h-6 text-green-400" /></div>
              <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">View Store</h3>
            <p className="text-white/50 text-sm">See how your store looks to customers, browse products, and test the shopping experience</p>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
