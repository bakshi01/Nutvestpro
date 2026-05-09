"use client";

import { useStore } from "@/lib/store";
import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const { navigate } = useStore();

  const categories = [
    { label: "Almonds", page: "/category/Almonds" },
    { label: "Cashews", page: "/category/Cashews" },
    { label: "Walnuts", page: "/category/Walnuts" },
    { label: "Pistachios", page: "/category/Pistachios" },
    { label: "Saffron", page: "/category/Saffron" },
    { label: "Raisins", page: "/category/Raisins" },
    { label: "Figs", page: "/category/Figs" },
    { label: "Pine Nuts", page: "/category/Pine Nuts" },
    { label: "Dates", page: "/category/Dates" },
    { label: "Apricots", page: "/category/Apricots" },
    { label: "Mixed Dry Fruits", page: "/category/Mixed" },
  ];

  return (
    <footer className="mt-auto border-t border-white/10 bg-black/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <button onClick={() => navigate("/")} className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="NutVest Logo" width={36} height={36} className="w-9 h-9 rounded-xl" />
              <span className="text-xl font-bold gold-gradient">NutVest</span>
            </button>
            <p className="text-white/50 text-sm leading-relaxed">
              Premium quality nuts and dry fruits sourced from the finest farms of Kashmir. Delivering freshness and authenticity from the heart of Bandipora.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-amber-400 font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Home", page: "/" },
                { label: "Shop All", page: "/products" },
                { label: "About Us", page: "/about" },
                { label: "Contact", page: "/contact" },
                { label: "Gallery", page: "/gallery" },
                { label: "Offers", page: "/offers" },
              ].map((item) => (
                <li key={item.page}>
                  <button onClick={() => navigate(item.page)} className="text-white/50 hover:text-amber-400 text-sm transition-colors">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-amber-400 font-semibold mb-4 text-sm uppercase tracking-wider">Categories</h3>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.page}>
                  <button onClick={() => navigate(cat.page)} className="text-white/50 hover:text-amber-400 text-sm transition-colors">
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-amber-400 font-semibold mb-4 text-sm uppercase tracking-wider">Policies</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Privacy Policy", page: "/privacy" },
                { label: "Terms & Conditions", page: "/terms" },
              ].map((item) => (
                <li key={item.page}>
                  <button onClick={() => navigate(item.page)} className="text-white/50 hover:text-amber-400 text-sm transition-colors">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-amber-400 font-semibold mb-4 text-sm uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <a href="https://wa.me/918899697765" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-amber-400 text-sm transition-colors">
                  +91 88996 97765
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <a href="mailto:nutvest1@gmail.com" className="text-white/50 hover:text-amber-400 text-sm transition-colors break-all">
                  nutvest1@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span className="text-white/50 text-sm">Bandipora, Kashmir, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} NutVest by Mohammad Sayeed. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">
            Designed &amp; Developed by <span className="text-amber-400 font-semibold">Bakshi Faheem</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
