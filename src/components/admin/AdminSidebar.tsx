"use client";

import { useStore } from "@/lib/store";
import {
  Package,
  Tag,
  Store,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";

const adminLinks = [
  { label: "Products", page: "/admin/products", icon: Package },
  { label: "Offers", page: "/admin/offers", icon: Tag },
];

export default function AdminSidebar() {
  const { currentPage, navigate, adminLogout } = useStore();

  const handleLogout = () => {
    adminLogout();
    navigate("/");
  };

  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 glass-dark border-r border-white/10 min-h-[calc(100vh-5rem)] sticky top-20">
      <div className="p-5 flex-1">
        <div className="flex items-center gap-2 mb-8">
          <Image src="/logo.png" alt="NutVest Logo" width={32} height={32} className="w-8 h-8 rounded-xl" />
          <div>
            <p className="text-white font-semibold text-sm">NutVest</p>
            <p className="text-white/40 text-xs">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-1">
          {adminLinks.map((link) => {
            const isActive = currentPage === link.page;
            return (
              <button key={link.page} onClick={() => navigate(link.page)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-amber-600/20 text-amber-400 border border-amber-500/30" : "text-white/60 hover:text-white hover:bg-white/5"}`}>
                <link.icon className="w-4 h-4" />{link.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-6 pt-6 border-t border-white/10">
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all">
            <Store className="w-4 h-4" />View Store<ChevronLeft className="w-3 h-3 ml-auto" />
          </button>
        </div>
      </div>

      <div className="p-5 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-amber-600/30">
            <Image src="/owner.jpg" alt="Mohammad Sayeed" width={36} height={36} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">Mohammad Sayeed</p>
            <p className="text-white/40 text-xs">Administrator</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut className="w-4 h-4" />Logout
        </button>
      </div>
    </aside>
  );
}
