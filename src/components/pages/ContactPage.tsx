"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactPage() {
  const { navigate } = useStore();
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = (): boolean => {
    if (!form.name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!form.email.trim()) {
      toast.error("Please enter your email address");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!form.phone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    if (!form.message.trim()) {
      toast.error("Please enter your message");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("Message sent successfully! We will get back to you soon.");
        setForm({ name: "", email: "", phone: "", message: "" });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const message = `Hello NutVest, I have an inquiry.`;
    window.open(
      `https://wa.me/918899697765?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mt-3 mb-4">
            Contact <span className="gold-gradient">Us</span>
          </h1>
          <p className="text-white/50 max-w-lg mx-auto leading-relaxed">
            Have a question, suggestion, or bulk order inquiry? We would love
            to hear from you. Reach out through any of the channels below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2 space-y-5">
            {/* Contact Details Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="glass-card p-6"
            >
              <h3 className="text-white font-semibold text-lg mb-5">
                Contact Information
              </h3>
              <div className="space-y-5">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/918899697765"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-600/15 flex items-center justify-center shrink-0 group-hover:bg-green-600/25 transition-colors">
                    <MessageCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
                      WhatsApp
                    </p>
                    <p className="text-white group-hover:text-green-400 transition-colors font-medium">
                      +91 88996 97765
                    </p>
                    <p className="text-white/30 text-xs mt-0.5">
                      Tap to chat directly
                    </p>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:nutvest1@gmail.com"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-600/15 flex items-center justify-center shrink-0 group-hover:bg-amber-600/25 transition-colors">
                    <Mail className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
                      Email
                    </p>
                    <p className="text-white group-hover:text-amber-400 transition-colors font-medium break-all">
                      nutvest1@gmail.com
                    </p>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href="tel:+918899697765"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-600/15 flex items-center justify-center shrink-0 group-hover:bg-amber-600/25 transition-colors">
                    <Phone className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
                      Phone
                    </p>
                    <p className="text-white group-hover:text-amber-400 transition-colors font-medium">
                      +91 88996 97765
                    </p>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600/15 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
                      Location
                    </p>
                    <p className="text-white font-medium">
                      Bandipora, Kashmir
                    </p>
                    <p className="text-white/40 text-sm">
                      India — Shipping Nationwide
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600/15 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
                      Business Hours
                    </p>
                    <p className="text-white font-medium">
                      Mon — Sat: 9:00 AM — 8:00 PM
                    </p>
                    <p className="text-white/50 text-sm">
                      Sunday: 10:00 AM — 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Google Maps Embed */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="glass-card overflow-hidden h-52"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26495.67129803489!2d74.62!3d34.42!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e1e7a7b3b3b3b3%3A0x3b3b3b3b3b3b3b3b!2sBandipora%2C%20Jammu%20and%20Kashmir!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter:
                    "invert(0.9) hue-rotate(180deg) brightness(0.8) contrast(1.2)",
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="NutVest Location - Bandipora, Kashmir"
              />
            </motion.div>

            {/* Quick WhatsApp CTA */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="glass-card p-5"
            >
              <p className="text-white/60 text-sm mb-3">
                Prefer instant messaging? Chat with us directly on WhatsApp for
                quick responses.
              </p>
              <button
                onClick={handleWhatsApp}
                className="btn-whatsapp w-full py-3 text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </button>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="lg:col-span-3"
          >
            <div className="glass-card p-6 sm:p-8">
              <h3 className="text-white font-semibold text-lg mb-1">
                Send us a Message
              </h3>
              <p className="text-white/40 text-sm mb-6">
                Fill out the form below and we will respond within 24 hours.
              </p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-green-600/15 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h4 className="text-white font-semibold text-lg mb-2">
                    Message Sent Successfully
                  </h4>
                  <p className="text-white/50 text-sm mb-6">
                    Thank you for reaching out. We will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-primary px-6 py-2.5 text-sm"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block font-medium">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="glass-input w-full"
                    />
                  </div>

                  {/* Email and Phone Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block font-medium">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className="glass-input w-full"
                      />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block font-medium">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        className="glass-input w-full"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block font-medium">
                      Message
                    </label>
                    <textarea
                      placeholder="How can we help you? Include any product inquiries, bulk order details, or general questions."
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      className="glass-input w-full min-h-[140px] resize-none"
                      rows={5}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Alternative Actions */}
              {!submitted && (
                <div className="mt-6 pt-5 border-t border-white/10">
                  <p className="text-white/40 text-xs text-center mb-3">
                    Or reach us directly through
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="https://wa.me/918899697765"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600/15 text-green-400 hover:bg-green-600/25 transition-colors text-sm font-medium"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                    <a
                      href="mailto:nutvest1@gmail.com"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-600/15 text-amber-400 hover:bg-amber-600/25 transition-colors text-sm font-medium"
                    >
                      <Mail className="w-4 h-4" />
                      Email Us
                    </a>
                    <button
                      onClick={() => navigate("/products")}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/8 text-white/60 hover:bg-white/12 hover:text-white transition-colors text-sm font-medium"
                    >
                      Browse Products
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
