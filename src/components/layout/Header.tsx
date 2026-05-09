"use client";

import { useStore } from "@/lib/store";
import {
  ShoppingCart,
  Menu,
  X,
  Home,
  ShoppingBag,
  Info,
  Phone,
  ShieldCheck,
  Tag,
  Camera,
  Search,
  ChevronRight,
  TreePine,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";

const navItems = [
  { label: "Home", page: "/", icon: Home },
  { label: "Shop All", page: "/products", icon: ShoppingBag },
  { label: "Offers", page: "/offers", icon: Tag },
  { label: "Gallery", page: "/gallery", icon: Camera },
  { label: "About Us", page: "/about", icon: Info },
  { label: "Contact", page: "/contact", icon: Phone },
];

const categoryItems = [
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

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  price: number;
  comparePrice: number | null;
  weight: string;
}

export default function Header() {
  const { currentPage, navigate, cart, sidePanelOpen, setSidePanelOpen, headerSearch, setHeaderSearch } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const [showDesktopResults, setShowDesktopResults] = useState(false);
  const [showMobileResults, setShowMobileResults] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setAllProducts)
      .catch(() => {});
  }, []);

  const searchResults = useMemo(() => {
    if (!headerSearch.trim()) return [];
    const q = headerSearch.toLowerCase().trim();
    const scored = allProducts
      .map((p) => {
        let score = 0;
        const nameLower = p.name.toLowerCase();
        const catLower = p.category.toLowerCase();
        const descLower = (p.description || "").toLowerCase();
        const weightLower = (p.weight || "").toLowerCase();

        if (nameLower === q) score += 100;
        else if (nameLower.startsWith(q)) score += 80;
        else if (nameLower.includes(q)) score += 60;

        if (catLower === q) score += 50;
        else if (catLower.includes(q)) score += 30;

        if (descLower.includes(q)) score += 20;
        if (weightLower.includes(q)) score += 10;

        return { product: p, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((item) => item.product);
    return scored;
  }, [headerSearch, allProducts]);

  const handleSearchNavigate = useCallback((page: string) => {
    navigate(page);
    setHeaderSearch("");
    setSearchOpen(false);
    setShowDesktopResults(false);
    setShowMobileResults(false);
  }, [navigate, setHeaderSearch]);

  // Close desktop results on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(e.target as Node)) {
        setShowDesktopResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile results on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)) {
        setShowMobileResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Body scroll lock for side panel
  useEffect(() => {
    if (sidePanelOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidePanelOpen]);

  const renderSearchResults = (isMobile: boolean) => {
    if (!headerSearch.trim()) return null;

    return (
      <div className={isMobile ? "search-dropdown-mobile" : "search-dropdown-desktop"}>
        {searchResults.length > 0 ? (
          <>
            {searchResults.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSearchNavigate(`/product/${p.id}`)}
                className="search-dropdown-item"
                aria-label={`Go to ${p.name}`}
              >
                <div
                  className="search-dropdown-thumb"
                  style={{ backgroundImage: `url(${p.image})` }}
                />
                <div className="search-dropdown-info">
                  <p className="search-dropdown-name">{p.name}</p>
                  <p className="search-dropdown-meta">
                    {p.category} <span className="text-white/15">·</span> {p.weight} <span className="text-white/15">·</span> <span className="text-amber-400/70">₹{p.price.toLocaleString()}{p.comparePrice ? ` was ₹${p.comparePrice.toLocaleString()}` : ""}</span>
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-white/15 shrink-0" />
              </button>
            ))}
            <button
              onClick={() => handleSearchNavigate("/products")}
              className="search-dropdown-viewall"
            >
              View all products →
            </button>
          </>
        ) : (
          <div className="search-dropdown-empty">
            <p className="text-white/40 text-sm mb-2">No products found for &ldquo;{headerSearch}&rdquo;</p>
            <button onClick={() => handleSearchNavigate("/products")} className="text-amber-400 text-xs hover:underline">Browse all products</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-nav shadow-lg shadow-black/20" : "glass-nav"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-3">
            {/* Hamburger */}
            <button onClick={() => setSidePanelOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors shrink-0" aria-label="Open menu">
              <Menu className="w-5 h-5 text-white" />
            </button>

            {/* Brand Name - No Logo in header only */}
            <button onClick={() => navigate("/")} className="flex flex-col items-start group shrink-0 leading-none" aria-label="NutVest Home">
              <span className="text-xl sm:text-2xl font-bold tracking-tight gold-gradient" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>NutVest</span>
              <span className="text-[9px] sm:text-[10px] text-white/40 tracking-widest uppercase font-light mt-0.5">From Kashmir With Love</span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = currentPage === item.page;
                return (
                  <button key={item.page} onClick={() => navigate(item.page)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${isActive ? "bg-amber-600/20 text-amber-400" : "text-white/70 hover:text-white hover:bg-white/5"}`}>
                    <item.icon className="w-3.5 h-3.5" />{item.label}
                  </button>
                );
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Desktop Search */}
              <div ref={desktopSearchRef} className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none z-10" />
                <input
                  ref={desktopInputRef}
                  type="text"
                  placeholder="Search nuts, dry fruits..."
                  aria-label="Search products"
                  value={headerSearch}
                  onChange={(e) => {
                    setHeaderSearch(e.target.value);
                    setShowDesktopResults(true);
                  }}
                  onFocus={() => setShowDesktopResults(true)}
                  className="desktop-search-input"
                />
                {headerSearch && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setHeaderSearch(""); setShowDesktopResults(false); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full z-10"
                  >
                    <X className="w-3.5 h-3.5 text-white/40" />
                  </button>
                )}
                {showDesktopResults && renderSearchResults(false)}
              </div>

              {/* Mobile Search Toggle */}
              <button onClick={() => { setSearchOpen(!searchOpen); setHeaderSearch(""); setShowMobileResults(false); }} className="p-2 rounded-lg hover:bg-white/10 transition-colors lg:hidden" aria-label="Search">
                <Search className="w-5 h-5 text-white/80" />
              </button>

              {/* Cart */}
              <button onClick={() => navigate("/cart")} className="relative p-2 rounded-lg hover:bg-white/10 transition-colors" aria-label="Cart">
                <ShoppingCart className="w-5 h-5 text-white/80" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-amber-600 rounded-full text-[10px] font-bold text-white flex items-center justify-center">{cartCount}</span>
                )}
              </button>

              {/* Desktop Admin */}
              <button onClick={() => navigate("/admin")} className={`hidden lg:flex px-3 py-2 rounded-lg text-sm font-medium transition-all items-center gap-1.5 ${currentPage.startsWith("/admin") ? "bg-amber-600/20 text-amber-400" : "text-white/70 hover:text-white hover:bg-white/5"}`}>
                <ShieldCheck className="w-3.5 h-3.5" />Admin
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="lg:hidden mobile-search-bar" ref={mobileSearchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none z-10" />
              <input
                ref={mobileInputRef}
                type="text"
                placeholder="Search nuts, dry fruits..."
                aria-label="Search products"
                value={headerSearch}
                onChange={(e) => {
                  setHeaderSearch(e.target.value);
                  setShowMobileResults(true);
                }}
                onFocus={() => setShowMobileResults(true)}
                className="mobile-search-input"
                autoFocus
              />
              {headerSearch && (
                <button
                  onClick={() => { setHeaderSearch(""); setShowMobileResults(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full z-10"
                >
                  <X className="w-3.5 h-3.5 text-white/40" />
                </button>
              )}
            </div>
            {showMobileResults && renderSearchResults(true)}
          </div>
        )}
      </header>

      {/* Side Panel Overlay */}
      {sidePanelOpen && <div className="side-panel-overlay" onClick={() => setSidePanelOpen(false)} />}

      {/* Sliding Side Panel - WITH LOGO */}
      <div className={`side-panel ${sidePanelOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <Image src="/logo.png" alt="NutVest" width={32} height={32} className="w-8 h-8 rounded-lg" />
            <span className="text-lg font-bold gold-gradient">NutVest</span>
          </button>
          <button onClick={() => setSidePanelOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors" aria-label="Close menu">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button key={item.page} onClick={() => navigate(item.page)} className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${isActive ? "bg-amber-600/20 text-amber-400" : "text-white/70 hover:text-white hover:bg-white/5"}`}>
                <item.icon className="w-4 h-4 shrink-0" />{item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-4 pb-2">
          <h3 className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2"><TreePine className="w-3.5 h-3.5" />Categories</h3>
        </div>
        <nav className="px-4 pb-4 space-y-0.5">
          {categoryItems.map((cat) => {
            const isActive = currentPage === cat.page;
            return (
              <button key={cat.page} onClick={() => navigate(cat.page)} className={`w-full px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between ${isActive ? "bg-amber-600/20 text-amber-400" : "text-white/60 hover:text-white hover:bg-white/5"}`}>
                {cat.label}<ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>
            );
          })}
        </nav>

        <div className="px-4 pb-2 border-t border-white/10 pt-4">
          <h3 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Legal</h3>
        </div>
        <nav className="px-4 pb-4 space-y-0.5">
          <button onClick={() => navigate("/privacy")} className="w-full px-4 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all text-left">Privacy Policy</button>
          <button onClick={() => navigate("/terms")} className="w-full px-4 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all text-left">Terms & Conditions</button>
          <button onClick={() => navigate("/admin")} className="w-full px-4 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5" />Admin Panel</button>
        </nav>

        <div className="mt-auto p-4 border-t border-white/10">
          <p className="text-white/30 text-xs text-center">Designed & Developed by <span className="text-amber-400/70 font-medium">Bakshi Faheem</span></p>
        </div>
      </div>
    </>
  );
}
