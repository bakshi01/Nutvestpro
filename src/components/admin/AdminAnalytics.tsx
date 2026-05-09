"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import {
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  Award,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

interface AnalyticsData {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  lowStock: number;
  salesByMonth: Record<string, number>;
  categoryDistribution: Record<string, number>;
  orderStatusDistribution: Record<string, number>;
  topProducts: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
}

const CHART_COLORS = [
  "#C8956C",
  "#D4A574",
  "#8B6914",
  "#5C3A21",
  "#F5E6D3",
  "#2C1810",
  "#e8a849",
  "#9a7b2e",
  "#6b4c2a",
  "#3d2b1a",
];

export default function AdminAnalytics() {
  const { navigate, isAdmin } = useStore();
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin");
      return;
    }
    fetch("/api/analytics")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, [isAdmin, navigate]);

  if (!isAdmin || !data) return null;

  // Prepare chart data
  const salesData = Object.entries(data.salesByMonth).map(
    ([month, revenue]) => ({
      month,
      revenue,
    })
  );

  const categoryData = Object.entries(data.categoryDistribution).map(
    ([name, value], index) => ({
      name,
      value,
      color: CHART_COLORS[index % CHART_COLORS.length],
    })
  );

  const statusData = Object.entries(data.orderStatusDistribution).map(
    ([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    })
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            <span className="gold-gradient">Analytics</span>
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Track your store performance and insights
          </p>
        </div>

        {/* Sales Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            Revenue Trend (Last 6 Months)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="month"
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={12}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={12}
                  tickFormatter={(v) => `₹${v.toLocaleString()}`}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(26, 14, 10, 0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#F5E6D3",
                  }}
                  formatter={(value: number) => [
                    `₹${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#C8956C"
                  strokeWidth={3}
                  dot={{ fill: "#C8956C", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: "#D4A574", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-amber-400" />
              Category Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(26, 14, 10, 0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#F5E6D3",
                    }}
                  />
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Order Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              Order Status
            </h3>
            {statusData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-white/30">
                No orders yet
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="rgba(255,255,255,0.3)"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.3)"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(26, 14, 10, 0.95)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#F5E6D3",
                      }}
                    />
                    <Bar dataKey="value" fill="#C8956C" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>
        </div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Top Selling Products
          </h3>
          {data.topProducts.length === 0 ? (
            <p className="text-white/30 text-center py-8">
              No sales data yet. Top products will appear here once orders come
              in!
            </p>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full min-w-[400px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-white/40 text-xs font-medium py-3 pr-4">
                      #
                    </th>
                    <th className="text-left text-white/40 text-xs font-medium py-3 pr-4">
                      Product
                    </th>
                    <th className="text-left text-white/40 text-xs font-medium py-3 pr-4">
                      Qty Sold
                    </th>
                    <th className="text-left text-white/40 text-xs font-medium py-3">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.topProducts.map((product, index) => (
                    <tr
                      key={product.name}
                      className="border-b border-white/5"
                    >
                      <td className="py-3 pr-4">
                        <span className="w-6 h-6 rounded-full bg-amber-600/20 text-amber-400 text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-white text-sm font-medium">
                          {product.name}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-white/60 text-sm">
                          {product.quantity}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-amber-400 font-medium text-sm">
                          ₹{product.revenue.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
