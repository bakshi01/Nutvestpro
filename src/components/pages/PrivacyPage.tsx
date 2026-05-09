"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { Shield, Lock, Eye, Database, Cookie, UserCheck, Mail, ArrowLeft } from "lucide-react";

const sections = [
  {
    icon: Database,
    title: "1. Information We Collect",
    content: [
      "At NutVest, we collect information that you provide to us directly when you place an order, create an account, contact us, or interact with our website. This includes your name, email address, phone number, delivery address, and payment information.",
      "We also collect certain information automatically when you visit our website, such as your IP address, browser type, operating system, referring URLs, pages viewed, and the dates and times of your visits. This information helps us understand how visitors use our website and enables us to improve our services.",
      "When you place an order via WhatsApp, the order details including your name, phone number, and delivery address are shared with us to process and fulfill your order. This data is handled with the same level of care and security as all other personal information we collect.",
    ],
  },
  {
    icon: Eye,
    title: "2. How We Use Your Information",
    content: [
      "We use the information we collect to process and fulfill your orders, communicate with you about your purchases, provide customer support, and send you order confirmations and shipping updates. Your information helps us improve our website functionality, personalize your shopping experience, and enhance our product offerings.",
      "We may also use your information to detect and prevent fraud, enforce our terms of service, comply with legal obligations, respond to lawful requests from public authorities, and protect the rights, privacy, property, or safety of NutVest, our customers, or others.",
      "We will never sell your personal information to third parties for their marketing purposes. We may send you promotional communications about new products, special offers, and events, but you may opt out of these communications at any time.",
    ],
  },
  {
    icon: Shield,
    title: "3. Information Sharing & Disclosure",
    content: [
      "We do not sell, trade, or rent your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, provided those parties agree to keep this information confidential.",
      "We may share your information with delivery partners to fulfill your orders, payment processors to process transactions, and service providers who assist with our business operations such as email delivery and analytics. All such third parties are bound by confidentiality obligations.",
      "We may also release your information when we believe release is appropriate to comply with applicable law, enforce our site policies, or protect ours or others' rights, property, or safety. Non-personally identifiable visitor information may be provided to other parties for marketing, advertising, or other uses.",
    ],
  },
  {
    icon: Lock,
    title: "4. Data Security",
    content: [
      "We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. We use encryption technology (SSL/TLS) to protect sensitive information transmitted online.",
      "Access to personal information is restricted to NutVest employees, contractors, and agents who need to know that information in order to process it on our behalf. These individuals are bound by confidentiality obligations and may be subject to discipline, including termination, if they fail to meet these obligations.",
      "While we strive to protect your personal information, no method of transmission over the Internet or method of electronic storage is 100% secure. Therefore, we cannot guarantee its absolute security. We encourage you to keep your contact information current and to protect your account credentials.",
    ],
  },
  {
    icon: Cookie,
    title: "5. Cookies & Tracking Technologies",
    content: [
      "We use cookies and similar tracking technologies to understand and save your preferences for future visits, keep track of advertisements, compile aggregate data about site traffic and site interaction, and deliver personalized content. Cookies are small data files stored on your device that help us improve your experience.",
      "We use both session cookies (which expire when you close your browser) and persistent cookies (which stay on your device until they expire or you delete them). We use strictly necessary cookies for site functionality, performance cookies to analyze how you use our site, and functionality cookies to remember your preferences.",
      "You can control cookies through your browser settings and other tools. However, if you block certain cookies, you may not be able to use all features of our website. Most web browsers are set to accept cookies by default, but you can usually change your browser settings to remove or reject cookies.",
    ],
  },
  {
    icon: UserCheck,
    title: "6. Your Rights & Choices",
    content: [
      "You have the right to access, correct, or delete your personal data at any time. You can also object to or restrict certain processing of your data, request data portability, and withdraw consent where applicable. We will respond to your request within 30 days of receipt.",
      "You may update or correct your personal information at any time by contacting us directly. You may also request that we delete your personal information, subject to certain exceptions such as where we are required to retain the information by law or for legitimate business purposes.",
      "To exercise any of these rights, please contact us at nutvest1@gmail.com or via WhatsApp at +91 88996 97765. We will verify your identity before processing your request and will not discriminate against you for exercising your privacy rights.",
    ],
  },
  {
    icon: Mail,
    title: "7. Contact Us",
    content: [
      "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us using the information provided below. We are committed to addressing your privacy concerns promptly and transparently.",
    ],
  },
];

export default function PrivacyPage() {
  const { navigate } = useStore();

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-12 h-12 rounded-xl bg-amber-600/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Privacy <span className="gold-gradient">Policy</span>
            </h1>
            <p className="text-white/40 text-sm">
              Last updated: May 8, 2026
            </p>
          </motion.div>
        </div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card p-6 sm:p-8 mb-6"
        >
          <p className="text-white/60 leading-relaxed">
            NutVest (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting the privacy and security of your personal information. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase from our store located in Bandipora, Kashmir, India. Please read this policy carefully to understand our practices regarding your personal data.
          </p>
        </motion.div>

        {/* Sections */}
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * (index + 1) }}
            className="glass-card p-6 sm:p-8 mb-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-600/15 flex items-center justify-center shrink-0">
                <section.icon className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="text-lg font-bold text-white">{section.title}</h2>
            </div>
            <div className="space-y-3">
              {section.content.map((paragraph, pIndex) => (
                <p key={pIndex} className="text-white/60 leading-relaxed text-sm">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Contact info in last section */}
            {section.title === "7. Contact Us" && (
              <div className="glass rounded-xl p-5 mt-4 space-y-2">
                <p className="text-white/70">
                  <span className="text-amber-400 font-semibold">NutVest</span> by Mohammad Sayeed
                </p>
                <p className="text-white/50 text-sm">Bandipora, Kashmir, India</p>
                <p className="text-white/50 text-sm">Email: nutvest1@gmail.com</p>
                <p className="text-white/50 text-sm">WhatsApp: +91 88996 97765</p>
              </div>
            )}
          </motion.div>
        ))}

        {/* Back */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/")}
            className="text-white/50 hover:text-amber-400 text-sm transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
