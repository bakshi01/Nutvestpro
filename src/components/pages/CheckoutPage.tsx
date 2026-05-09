"use client";

import { useStore } from "@/lib/store";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MessageCircle,
  User,
  Phone,
  Mail,
  MapPin,
  Loader2,
  ShoppingBag,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { cart, navigate, clearCart } = useStore();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    else if (!/^\+?[\d\s-]{10,}$/.test(form.phone.trim()))
      errs.phone = "Enter a valid phone number";
    if (!form.email.trim()) errs.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      errs.email = "Enter a valid email address";
    if (!form.address.trim()) errs.address = "Delivery address is required";
    else if (form.address.trim().length < 10)
      errs.address = "Please enter a complete address with pin code";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.name,
          customerPhone: form.phone,
          customerEmail: form.email,
          customerAddress: form.address,
          items: cart.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: total,
        }),
      });

      if (res.ok) {
        // Build WhatsApp message with user details + cart items
        const itemsText = cart
          .map(
            (item) =>
              `• ${item.name} (${item.weight}) x${item.quantity} — ₹${(
                item.price * item.quantity
              ).toLocaleString()}`
          )
          .join("\n");
        const message = `🥜 *NutVest Order*\n\n👤 Name: ${form.name}\n📞 Phone: ${form.phone}\n📧 Email: ${form.email}\n📍 Address: ${form.address}\n\n📦 *Order Items:*\n${itemsText}\n\nSubtotal: ₹${subtotal.toLocaleString()}\nShipping: ${
          shipping === 0 ? "FREE" : `₹${shipping}`
        }\n*Total: ₹${total.toLocaleString()}*\n\nPlease confirm my order!`;
        const encoded = encodeURIComponent(message);

        clearCart();
        toast.success("Order placed successfully!");
        window.open(`https://wa.me/918899697765?text=${encoded}`, "_blank");
        navigate("/");
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm mx-auto"
        >
          <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-white/20" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            No items to checkout
          </h2>
          <p className="text-white/50 mb-8 text-sm sm:text-base">
            Add some products to your cart first
          </p>
          <button
            onClick={() => navigate("/products")}
            className="btn-primary px-8 py-3"
          >
            Browse Products
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-white/50 hover:text-amber-400 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Cart
        </motion.button>

        {/* Page title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-8">
          <span className="gold-gradient">Checkout</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Delivery Details Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="glass-card p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-amber-400/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-white font-semibold text-lg">
                  Delivery Details
                </h3>
              </div>

              <div className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="text-white/60 text-sm mb-2 flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Full Name{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={`glass-input w-full ${
                      errors.name
                        ? "border-red-400/50 focus:border-red-400 focus:ring-red-400/20"
                        : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-400" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Phone and Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Phone Number */}
                  <div>
                    <label className="text-white/60 text-sm mb-2 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" /> Phone Number{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className={`glass-input w-full ${
                        errors.phone
                          ? "border-red-400/50 focus:border-red-400 focus:ring-red-400/20"
                          : ""
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-red-400" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-white/60 text-sm mb-2 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" /> Email{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className={`glass-input w-full ${
                        errors.email
                          ? "border-red-400/50 focus:border-red-400 focus:ring-red-400/20"
                          : ""
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-red-400" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="text-white/60 text-sm mb-2 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" /> Delivery Address{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    placeholder="Enter your full delivery address with city, state and pin code"
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className={`glass-input w-full min-h-[110px] resize-none ${
                      errors.address
                        ? "border-red-400/50 focus:border-red-400 focus:ring-red-400/20"
                        : ""
                    }`}
                    rows={4}
                  />
                  {errors.address && (
                    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-400" />
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-whatsapp w-full py-3.5 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5" />
                      Place Order via WhatsApp
                    </>
                  )}
                </button>
              </div>

              {/* Trust indicator */}
              <div className="flex items-center justify-center gap-4 mt-4">
                {[
                  { icon: CheckCircle2, text: "Secure Order" },
                  { icon: CheckCircle2, text: "Instant Confirmation" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-1 text-white/25 text-xs"
                  >
                    <item.icon className="w-3 h-3" />
                    {item.text}
                  </div>
                ))}
              </div>
            </form>
          </motion.div>

          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="glass-card p-6 sticky top-24">
              <h3 className="text-white font-semibold text-lg mb-5">
                Order Summary
              </h3>

              {/* Cart Items List */}
              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0 ring-1 ring-white/10"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-white/40 text-xs">
                        {item.weight} &middot; Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-white text-sm font-medium shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-white/10 pt-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">
                    Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})
                  </span>
                  <span className="text-white font-medium">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Shipping</span>
                  <span
                    className={
                      shipping === 0
                        ? "text-green-400 font-medium"
                        : "text-white font-medium"
                    }
                  >
                    {shipping === 0
                      ? "FREE"
                      : `₹${shipping.toLocaleString()}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-amber-400/70 text-xs">
                    Free shipping on orders above ₹999
                  </p>
                )}
                <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-amber-400 font-bold text-xl">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
