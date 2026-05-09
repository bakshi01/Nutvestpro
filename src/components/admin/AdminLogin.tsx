"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import Image from "next/image";

export default function AdminLogin() {
  const { adminLogin, navigate } = useStore();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(password)) {
      toast.success("Welcome back, Admin!");
      navigate("/admin/dashboard");
    } else {
      toast.error("Incorrect password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 sm:p-12 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="NutVest Logo"
            width={64}
            height={64}
            className="w-16 h-16 rounded-2xl mx-auto mb-4 shadow-lg shadow-amber-600/20"
          />
          <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-white/40 text-sm">
            Enter the admin password to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-white/60 text-sm mb-1.5 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full pr-10"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-3.5">
            Login to Dashboard
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-white/40 hover:text-amber-400 text-sm transition-colors flex items-center gap-2 mx-auto"
          >
            ← Back to Store
          </button>
        </div>
      </motion.div>
    </div>
  );
}
