"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";

export default function WhatsAppButton() {
  const { currentPage } = useStore();

  // Don't show on admin pages
  if (currentPage.startsWith("/admin")) return null;

  return (
    <motion.a
      href="https://wa.me/918899697765"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg shadow-green-600/30 hover:shadow-green-600/50 hover:scale-110 transition-all duration-300 safe-bottom group"
      title="Chat on WhatsApp"
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />

      {/* WhatsApp icon */}
      <MessageCircle className="w-6 h-6 text-white relative z-10" />

      {/* Tooltip on hover */}
      <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-white/10">
        Chat with us
      </span>
    </motion.a>
  );
}
