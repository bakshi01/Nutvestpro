"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  MessageCircle,
  Gift,
  Timer,
  Tag,
  Truck,
  Package,
  X,
  Percent,
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

function OrderNowDialog({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.address.trim()) errs.address = "Delivery address is required";
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const discount = product.comparePrice
      ? Math.round(
          ((product.comparePrice - product.price) / product.comparePrice) * 100
        )
      : 0;
    const message = `*NutVest Offer Order*

Product: ${product.name}
Weight: ${product.weight}
Price: Rs ${product.price.toLocaleString()}${
      product.comparePrice
        ? ` (was Rs ${product.comparePrice.toLocaleString()}, ${discount}% OFF)`
        : ""
    }

Customer Details:
Name: ${form.name}
Phone: ${form.phone}
Address: ${form.address}

Please confirm my order!`;
    window.open(
      `https://wa.me/918899697765?text=${encodeURIComponent(message)}`,
      "_blank"
    );
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass-card p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-white">Quick Order</h3>
            <p className="text-white/40 text-xs mt-0.5">{product.name} - {product.weight}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-white/50" />
          </button>
        </div>

        <div className="flex items-baseline gap-2 mb-5 p-3 rounded-lg bg-white/5">
          <span className="text-xl font-bold text-amber-400">
            Rs {product.price.toLocaleString()}
          </span>
          {product.comparePrice && (
            <>
              <span className="text-sm text-white/30 line-through">
                Rs {product.comparePrice.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                {Math.round(
                  ((product.comparePrice - product.price) /
                    product.comparePrice) *
                    100
                )}
                % OFF
              </span>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white/60 text-sm mb-1.5 block font-medium">
              Full Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="glass-input w-full"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1.5 block font-medium">
              Phone Number
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="glass-input w-full"
              placeholder="+91 98765 43210"
            />
            {errors.phone && (
              <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1.5 block font-medium">
              Delivery Address
            </label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="glass-input w-full min-h-[80px] resize-none"
              placeholder="Full address with pin code"
              rows={3}
            />
            {errors.address && (
              <p className="text-red-400 text-xs mt-1">{errors.address}</p>
            )}
          </div>
          <button type="submit" className="btn-whatsapp w-full py-3 text-sm">
            <MessageCircle className="w-4 h-4" />
            Order via WhatsApp
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function OffersPage() {
  const { navigate, addToCart } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data.filter((p) => p.comparePrice && p.comparePrice > p.price));
      })
      .catch(console.error);
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      weight: product.weight,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4">
      {orderProduct && (
        <OrderNowDialog
          product={orderProduct}
          onClose={() => setOrderProduct(null)}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 sm:p-12 mb-10 text-center relative overflow-hidden"
        >
          <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-amber-500/5 blur-2xl" />
          <div className="absolute bottom-4 left-4 w-32 h-32 rounded-full bg-amber-600/5 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Gift className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">
                Special Deals
              </span>
              <Gift className="w-5 h-5 text-amber-400" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3">
              Today&apos;s <span className="gold-gradient">Offers</span>
            </h1>
            <p className="text-white/50 max-w-lg mx-auto mb-4">
              Grab exclusive deals on premium nuts and dry fruits. Limited time offers you don&apos;t want to miss.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Timer className="w-4 h-4" />
                <span>Limited Time</span>
              </div>
              <div className="flex items-center gap-1.5 text-green-400">
                <Tag className="w-4 h-4" />
                <span>Best Prices</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Offer highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            {
              title: "Free Shipping",
              desc: "On orders above Rs 999",
              icon: Truck,
              color: "from-green-600/20 to-green-800/20",
              iconColor: "text-green-400",
            },
            {
              title: "Bulk Discount",
              desc: "Extra 10% off on 5+ items",
              icon: Package,
              color: "from-amber-600/20 to-amber-800/20",
              iconColor: "text-amber-400",
            },
            {
              title: "WhatsApp Order",
              desc: "Direct & easy ordering",
              icon: MessageCircle,
              color: "from-emerald-600/20 to-emerald-800/20",
              iconColor: "text-emerald-400",
            },
          ].map((offer, index) => (
            <motion.div
              key={offer.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-6 text-center bg-gradient-to-br ${offer.color}`}
            >
              <offer.icon className={`w-7 h-7 ${offer.iconColor} mx-auto mb-3`} />
              <h3 className="text-white font-bold text-lg">{offer.title}</h3>
              <p className="text-white/50 text-sm mt-1">{offer.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Discounted Products */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Percent className="w-6 h-6 text-red-400" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Discounted <span className="gold-gradient">Products</span>
            </h2>
            <span className="ml-2 px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">
              {products.length} DEALS
            </span>
          </div>

          {products.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Gift className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-lg font-medium">No current offers</p>
              <p className="text-white/30 text-sm mt-1 mb-4">
                Check back soon for exciting deals on our premium collection
              </p>
              <button
                onClick={() => navigate("/products")}
                className="btn-primary px-6 py-2.5 text-sm"
              >
                Browse All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((product, index) => {
                const discount = product.comparePrice
                  ? Math.round(
                      ((product.comparePrice - product.price) /
                        product.comparePrice) *
                        100
                    )
                  : 0;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.05, 0.3) }}
                    className="glass-card glass-card-hover group transition-all duration-300 flex flex-col relative"
                  >
                    {/* Discount badge */}
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-red-500/90 text-white text-xs font-bold rounded-lg shadow-lg">
                        {discount}% OFF
                      </span>
                    )}
                    {product.stock < 10 && product.stock > 0 && (
                      <span className="absolute top-3 right-3 z-10 px-2 py-1 bg-orange-500/90 text-white text-xs font-bold rounded-lg">
                        Low Stock
                      </span>
                    )}
                    {product.stock === 0 && (
                      <span className="absolute top-3 right-3 z-10 px-2 py-1 bg-gray-600/90 text-white text-xs font-bold rounded-lg">
                        Sold Out
                      </span>
                    )}

                    {/* Image */}
                    <div
                      className="product-card-image cursor-pointer"
                      style={{ backgroundImage: `url(${product.image})` }}
                      onClick={() => navigate(`/product/${product.id}`)}
                    />

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <button
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="text-left mb-1"
                      >
                        <h3 className="text-white font-semibold text-sm group-hover:text-amber-400 transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </button>
                      <p className="text-white/40 text-xs mb-3">
                        {product.weight} | {product.category}
                      </p>

                      {/* Pricing - Amazon style */}
                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-amber-400">
                            Rs {product.price.toLocaleString()}
                          </span>
                          {product.comparePrice && (
                            <span className="text-sm text-white/30 line-through">
                              Rs {product.comparePrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {discount > 0 && (
                          <p className="text-green-400 text-xs font-medium mt-1">
                            You save Rs{" "}
                            {(
                              (product.comparePrice ?? 0) - product.price
                            ).toLocaleString()}{" "}
                            on this order
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-auto flex gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                          className="btn-primary flex-1 py-2.5 text-xs flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Add to Cart
                        </button>
                        <button
                          onClick={() => setOrderProduct(product)}
                          disabled={product.stock === 0}
                          className="btn-whatsapp flex-1 py-2.5 text-xs flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          Order Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
