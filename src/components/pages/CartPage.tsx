"use client";

import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  MessageCircle,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Package,
} from "lucide-react";
import { toast } from "sonner";

export default function CartPage() {
  const { cart, navigate, updateQuantity, removeFromCart, clearCart } =
    useStore();

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;
    const itemsText = cart
      .map(
        (item) =>
          `• ${item.name} (${item.weight}) x${item.quantity} — ₹${(
            item.price * item.quantity
          ).toLocaleString()}`
      )
      .join("\n");
    const message = `🥜 *NutVest Order*\n\n${itemsText}\n\nSubtotal: ₹${subtotal.toLocaleString()}\nShipping: ${
      shipping === 0 ? "FREE" : `₹${shipping}`
    }\n*Total: ₹${total.toLocaleString()}*\n\nPlease confirm my order!`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/918899697765?text=${encoded}`, "_blank");
  };

  const handleRemove = (id: string, name: string) => {
    removeFromCart(id);
    toast.success(`${name} removed from cart`);
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
            Your cart is empty
          </h2>
          <p className="text-white/50 mb-8 text-sm sm:text-base leading-relaxed">
            Discover our premium collection of Kashmiri dry fruits and add some items to your cart!
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
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-white/50 hover:text-amber-400 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Continue Shopping
        </motion.button>

        {/* Page title */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Shopping <span className="gold-gradient">Cart</span>
          </h1>
          <span className="text-white/40 text-sm">
            {totalItems} item{totalItems !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="glass-card p-4 sm:p-5"
                >
                  <div className="flex gap-4">
                    {/* Item Image */}
                    <div
                      className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl bg-cover bg-center shrink-0 cursor-pointer ring-1 ring-white/10 hover:ring-amber-400/30 transition-all"
                      style={{ backgroundImage: `url(${item.image})` }}
                      onClick={() => navigate(`/product/${item.id}`)}
                    />

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3
                              className="text-white font-semibold text-sm sm:text-base cursor-pointer hover:text-amber-400 transition-colors truncate"
                              onClick={() => navigate(`/product/${item.id}`)}
                            >
                              {item.name}
                            </h3>
                            <p className="text-white/40 text-xs sm:text-sm mt-0.5">
                              {item.weight}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemove(item.id, item.name)}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-white/30 hover:text-red-400 shrink-0"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 sm:mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 glass rounded-lg px-1 py-0.5">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1.5 sm:p-2 hover:bg-white/10 rounded-md transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                          </button>
                          <span className="w-8 text-center text-white text-sm font-semibold select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1.5 sm:p-2 hover:bg-white/10 rounded-md transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <span className="text-amber-400 font-bold text-base sm:text-lg">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Clear Cart */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  clearCart();
                  toast.success("Cart cleared");
                }}
                className="flex items-center gap-2 text-red-400/60 hover:text-red-400 text-sm transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear entire cart
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { icon: Truck, label: "Free Shipping ₹999+" },
                { icon: ShieldCheck, label: "100% Authentic" },
                { icon: Package, label: "Secure Packaging" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="glass rounded-xl p-3 text-center"
                >
                  <badge.icon className="w-4 h-4 text-amber-400 mx-auto mb-1.5" />
                  <span className="text-white/40 text-[10px] sm:text-xs leading-tight block">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h3 className="text-white font-semibold text-lg mb-5">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
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
                  <p className="text-amber-400/70 text-xs bg-amber-400/5 rounded-lg px-3 py-2">
                    Add ₹{(999 - subtotal).toLocaleString()} more for free
                    shipping!
                  </p>
                )}
                {shipping === 0 && (
                  <p className="text-green-400/70 text-xs bg-green-400/5 rounded-lg px-3 py-2">
                    🎉 You qualify for free shipping!
                  </p>
                )}
                <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-amber-400 font-bold text-xl">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/checkout")}
                  className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={handleWhatsAppOrder}
                  className="btn-whatsapp w-full py-3.5 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <MessageCircle className="w-5 h-5" />
                  Order via WhatsApp
                </button>
              </div>

              <p className="text-white/25 text-[10px] text-center mt-4">
                By placing an order, you agree to our terms & conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
