"use client";

import { useStore } from "@/lib/store";
import { Package, Tag, Store, LogOut } from "lucide-react";

const adminLinks = [
  { label: "Products", page: "/admin/products", icon: Package },
  { label: "Offers", page: "/admin/offers", icon: Tag },
];

export default function AdminMobileNav() {
  const { currentPage, navigate, adminLogout } = useStore();

  const handleLogout = () => {
    adminLogout();
    navigate("/");
  };

  return (
    <div className="lg:hidden glass-dark border-t border-white/10 sticky bottom-0 z-40">
      <div className="flex items-center justify-around py-2 px-2">
        {adminLinks.map((link) => {
          const isActive = currentPage === link.page;
          return (
            <button key={link.page} onClick={() => navigate(link.page)} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs transition-all ${isActive ? "text-amber-400" : "text-white/50 hover:text-white"}`}>
              <link.icon className="w-5 h-5" /><span>{link.label}</span>
            </button>
          );
        })}
        <button onClick={() => navigate("/")} className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs text-white/50 hover:text-white transition-all">
          <Store className="w-5 h-5" /><span>Store</span>
        </button>
        <button onClick={handleLogout} className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs text-red-400/60 hover:text-red-400 transition-all">
          <LogOut className="w-5 h-5" /><span>Logout</span>
        </button>
      </div>
    </div>
  );
}
