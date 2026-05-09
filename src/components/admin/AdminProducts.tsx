"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Search,
  Package,
  Filter,
  Star,
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

const categories = [
  "Almonds",
  "Cashews",
  "Walnuts",
  "Pistachios",
  "Saffron",
  "Raisins",
  "Figs",
  "Pine Nuts",
  "Mixed",
  "Apricots",
  "Dates",
];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  comparePrice: "",
  category: "Almonds",
  image: "",
  weight: "250g",
  stock: "0",
  featured: false,
};

export default function AdminProducts() {
  const { navigate, isAdmin } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin");
      return;
    }
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice
          ? parseFloat(form.comparePrice)
          : null,
        category: form.category,
        image: form.image,
        weight: form.weight,
        stock: parseInt(form.stock),
        featured: form.featured,
        rating: 4.5,
        reviews: 0,
      };

      if (editingId) {
        const res = await fetch(`/api/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          toast.success("Product updated successfully");
        } else {
          toast.error("Failed to update product");
        }
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          toast.success("Product created successfully");
        } else {
          toast.error("Failed to create product");
        }
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchProducts();
    } catch {
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      comparePrice: product.comparePrice?.toString() || "",
      category: product.category,
      image: product.image,
      weight: product.weight,
      stock: product.stock.toString(),
      featured: product.featured,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Product deleted");
        fetchProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Product <span className="gold-gradient">Management</span>
            </h1>
            <p className="text-white/40 text-sm mt-1">
              {products.length} products in catalog
            </p>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
              setShowForm(true);
            }}
            className="btn-primary px-4 py-2.5 text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input w-full pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
              showFilters
                ? "bg-amber-600/20 text-amber-400 border border-amber-500/30"
                : "glass text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Category filter row */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mb-6"
            >
              <div className="glass-card p-4">
                <div className="flex flex-wrap gap-2">
                  {["All", ...categories].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        categoryFilter === cat
                          ? "bg-amber-600/20 text-amber-400 border border-amber-500/30"
                          : "glass text-white/60 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="glass-card w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Fixed Header */}
                <div className="flex items-center justify-between p-6 pb-4 border-b border-white/10 shrink-0">
                  <h2 className="text-xl font-bold text-white">
                    {editingId ? "Edit Product" : "Add New Product"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white/60" />
                  </button>
                </div>

                {/* Scrollable Form Body */}
                <div className="flex-1 overflow-y-auto p-6 pt-4 admin-form-scroll overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block font-medium">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="glass-input w-full"
                      placeholder="e.g., Premium Kashmiri Almonds"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block font-medium">
                      Description *
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      className="glass-input w-full min-h-[80px] resize-none"
                      rows={3}
                      placeholder="Product description..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block font-medium">
                        Price (Rs) *
                      </label>
                      <input
                        type="number"
                        value={form.price}
                        onChange={(e) =>
                          setForm({ ...form, price: e.target.value })
                        }
                        className="glass-input w-full"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block font-medium">
                        Compare Price (Rs)
                      </label>
                      <input
                        type="number"
                        value={form.comparePrice}
                        onChange={(e) =>
                          setForm({ ...form, comparePrice: e.target.value })
                        }
                        className="glass-input w-full"
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block font-medium">
                        Category *
                      </label>
                      <select
                        value={form.category}
                        onChange={(e) =>
                          setForm({ ...form, category: e.target.value })
                        }
                        className="glass-input w-full"
                      >
                        {categories.map((cat) => (
                          <option
                            key={cat}
                            value={cat}
                            className="bg-[#1a0e0a]"
                          >
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block font-medium">
                        Weight *
                      </label>
                      <input
                        type="text"
                        value={form.weight}
                        onChange={(e) =>
                          setForm({ ...form, weight: e.target.value })
                        }
                        className="glass-input w-full"
                        placeholder="e.g., 250g, 500g, 1kg"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block font-medium">
                      Stock *
                    </label>
                    <input
                      type="number"
                      value={form.stock}
                      onChange={(e) =>
                        setForm({ ...form, stock: e.target.value })
                      }
                      className="glass-input w-full"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block font-medium">
                      Image
                    </label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={form.image}
                        onChange={(e) =>
                          setForm({ ...form, image: e.target.value })
                        }
                        className="glass-input flex-1"
                        placeholder="/products/image.jpg or URL"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="glass px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
                        title="Upload image file"
                      >
                        <Upload className="w-4 h-4 text-white/60" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    {form.image && (
                      <div className="mt-2 w-20 h-20 rounded-lg bg-cover bg-center ring-1 ring-white/10" style={{ backgroundImage: `url(${form.image})` }} />
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={form.featured}
                      onChange={(e) =>
                        setForm({ ...form, featured: e.target.checked })
                      }
                      className="w-4 h-4 accent-amber-600"
                    />
                    <label
                      htmlFor="featured"
                      className="text-white/60 text-sm cursor-pointer flex items-center gap-1.5"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      Featured Product
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3 disabled:opacity-50 mt-2"
                  >
                    {loading
                      ? "Saving..."
                      : editingId
                      ? "Update Product"
                      : "Create Product"}
                  </button>
                </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-white/40 text-sm">
            Showing {filtered.length} of {products.length} products
          </p>
          {(search || categoryFilter !== "All") && (
            <button
              onClick={() => {
                setSearch("");
                setCategoryFilter("All");
              }}
              className="text-amber-400 hover:text-amber-300 text-xs underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Products Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/40 text-xs font-medium py-4 px-6 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="text-left text-white/40 text-xs font-medium py-4 px-4 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left text-white/40 text-xs font-medium py-4 px-4 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-left text-white/40 text-xs font-medium py-4 px-4 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="text-left text-white/40 text-xs font-medium py-4 px-4 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="text-right text-white/40 text-xs font-medium py-4 px-6 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16">
                      <Package className="w-12 h-12 text-white/20 mx-auto mb-3" />
                      <p className="text-white/40 font-medium">No products found</p>
                      <p className="text-white/25 text-sm mt-1">
                        {search || categoryFilter !== "All"
                          ? "Try adjusting your search or filters"
                          : "Add your first product to get started"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg bg-cover bg-center shrink-0 ring-1 ring-white/10"
                            style={{
                              backgroundImage: `url(${product.image})`,
                            }}
                          />
                          <div className="min-w-0">
                            <p className="text-white font-medium text-sm truncate max-w-[200px]">
                              {product.name}
                            </p>
                            <p className="text-white/30 text-xs">
                              {product.weight}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-white/5 text-white/60 text-xs rounded-md font-medium">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-amber-400 font-medium text-sm">
                          Rs {product.price.toLocaleString()}
                        </span>
                        {product.comparePrice && (
                          <span className="text-white/30 text-xs line-through ml-1.5">
                            Rs {product.comparePrice.toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-sm font-medium ${
                            product.stock > 10
                              ? "text-green-400"
                              : product.stock > 0
                              ? "text-orange-400"
                              : "text-red-400"
                          }`}
                        >
                          {product.stock}
                        </span>
                        {product.stock === 0 && (
                          <span className="text-red-400/60 text-xs ml-1">Out</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {product.featured ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-600/20 text-amber-400 text-xs rounded-full font-medium">
                            <Star className="w-3 h-3 fill-amber-400" />
                            Featured
                          </span>
                        ) : (
                          <span className="text-white/20 text-xs">--</span>
                        )}
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 hover:bg-amber-600/10 rounded-lg transition-colors"
                            title="Edit product"
                          >
                            <Pencil className="w-4 h-4 text-amber-400" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(product.id, product.name)
                            }
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
