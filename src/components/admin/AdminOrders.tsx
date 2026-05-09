"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { Clock, Eye } from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  items: string;
  totalAmount: number;
  status: string;
  whatsappSent: boolean;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

const statusOptions = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const { navigate, isAdmin } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch {
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin");
      return;
    }
    // Use a separate async function to avoid lint warning
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (!cancelled) setOrders(data);
      } catch {
        if (!cancelled) toast.error("Failed to fetch orders");
      }
    };
    load();
    return () => { cancelled = true; };
  }, [isAdmin, navigate]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success("Order status updated");
        fetchOrders();
        if (selectedOrder?.id === id) {
          setSelectedOrder({ ...selectedOrder, status });
        }
      }
    } catch {
      toast.error("Failed to update order status");
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen pt-6 pb-20 lg:pb-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Order <span className="gold-gradient">Management</span>
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {orders.length} total orders
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Clock className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-lg">No orders yet</p>
            <p className="text-white/30 text-sm mt-1">
              Orders will appear here when customers place them
            </p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-white/40 text-xs font-medium py-4 px-6">
                      Customer
                    </th>
                    <th className="text-left text-white/40 text-xs font-medium py-4 px-4">
                      Amount
                    </th>
                    <th className="text-left text-white/40 text-xs font-medium py-4 px-4">
                      Status
                    </th>
                    <th className="text-left text-white/40 text-xs font-medium py-4 px-4">
                      Date
                    </th>
                    <th className="text-left text-white/40 text-xs font-medium py-4 px-4">
                      WhatsApp
                    </th>
                    <th className="text-right text-white/40 text-xs font-medium py-4 px-6">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-6">
                        <p className="text-white text-sm font-medium">
                          {order.customerName}
                        </p>
                        <p className="text-white/40 text-xs">
                          {order.customerPhone}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-amber-400 font-medium text-sm">
                          ₹{order.totalAmount.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateStatus(order.id, e.target.value)
                          }
                          className="glass-input text-xs py-1 px-2"
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s} className="bg-[#1a0e0a]">
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white/40 text-xs">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {order.whatsappSent ? (
                          <span className="text-green-400 text-xs">Sent</span>
                        ) : (
                          <span className="text-white/30 text-xs">Pending</span>
                        )}
                      </td>
                      <td className="py-3 px-6">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 hover:bg-amber-600/10 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4 text-amber-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/40 text-xs mb-1">Customer</p>
                    <p className="text-white text-sm font-medium">
                      {selectedOrder.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs mb-1">Phone</p>
                    <p className="text-white text-sm">
                      {selectedOrder.customerPhone}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs mb-1">Email</p>
                    <p className="text-white text-sm break-all">
                      {selectedOrder.customerEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs mb-1">Status</p>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        statusColors[selectedOrder.status] ||
                        "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {selectedOrder.status.charAt(0).toUpperCase() +
                        selectedOrder.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-white/40 text-xs mb-1">Address</p>
                  <p className="text-white text-sm">
                    {selectedOrder.customerAddress}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-white/40 text-xs mb-2">Items</p>
                  <div className="space-y-2">
                    {(() => {
                      try {
                        const items = JSON.parse(
                          selectedOrder.items
                        ) as OrderItem[];
                        return items.map((item, i) => (
                          <div
                            key={i}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-white/70">
                              {item.name} x{item.quantity}
                            </span>
                            <span className="text-white">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ));
                      } catch {
                        return (
                          <p className="text-white/40 text-sm">
                            Unable to parse items
                          </p>
                        );
                      }
                    })()}
                  </div>
                  <div className="border-t border-white/10 mt-3 pt-3 flex justify-between">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-amber-400 font-bold">
                      ₹{selectedOrder.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-white/40 text-xs mb-1">Order Date</p>
                  <p className="text-white text-sm">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      updateStatus(selectedOrder.id, e.target.value)
                    }
                    className="glass-input flex-1"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s} className="bg-[#1a0e0a]">
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="btn-primary px-4 py-2 text-sm"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
