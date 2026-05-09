"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import HomePage from "@/components/pages/HomePage";
import ProductsPage from "@/components/pages/ProductsPage";
import ProductDetailPage from "@/components/pages/ProductDetailPage";
import CartPage from "@/components/pages/CartPage";
import CheckoutPage from "@/components/pages/CheckoutPage";
import AboutPage from "@/components/pages/AboutPage";
import ContactPage from "@/components/pages/ContactPage";
import GalleryPage from "@/components/pages/GalleryPage";
import OffersPage from "@/components/pages/OffersPage";
import PrivacyPage from "@/components/pages/PrivacyPage";
import TermsPage from "@/components/pages/TermsPage";
import CategoryPage from "@/components/pages/CategoryPage";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminOffers from "@/components/admin/AdminOffers";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMobileNav from "@/components/admin/AdminMobileNav";
import { AnimatePresence, motion } from "framer-motion";

function Router() {
  const { currentPage, isAdmin } = useStore();

  const renderPage = () => {
    if (currentPage === "/admin") return isAdmin ? <AdminDashboard /> : <AdminLogin />;
    if (currentPage === "/admin/dashboard") return isAdmin ? <AdminDashboard /> : <AdminLogin />;
    if (currentPage === "/admin/products") return isAdmin ? <AdminProducts /> : <AdminLogin />;
    if (currentPage === "/admin/offers") return isAdmin ? <AdminOffers /> : <AdminLogin />;

    if (currentPage.startsWith("/product/")) {
      const id = currentPage.replace("/product/", "");
      return <ProductDetailPage productId={id} />;
    }

    if (currentPage.startsWith("/category/")) {
      const cat = currentPage.replace("/category/", "");
      return <CategoryPage categoryName={decodeURIComponent(cat)} />;
    }

    switch (currentPage) {
      case "/": return <HomePage />;
      case "/products": return <ProductsPage />;
      case "/cart": return <CartPage />;
      case "/checkout": return <CheckoutPage />;
      case "/about": return <AboutPage />;
      case "/contact": return <ContactPage />;
      case "/gallery": return <GalleryPage />;
      case "/offers": return <OffersPage />;
      case "/privacy": return <PrivacyPage />;
      case "/terms": return <TermsPage />;
      default: return <HomePage />;
    }
  };

  const isAdminPage = currentPage.startsWith("/admin") && isAdmin;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {isAdminPage ? (
          <div className="pt-16 sm:pt-20">
            <div className="flex">
              <AdminSidebar />
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderPage()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <AdminMobileNav />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
}

export default function Home() {
  const { navigate } = useStore();

  useEffect(() => {
    const hash = window.location.hash.replace("#", "") || "/";
    navigate(hash);
    const handleHashChange = () => {
      const newHash = window.location.hash.replace("#", "") || "/";
      navigate(newHash);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [navigate]);

  return <Router />;
}
