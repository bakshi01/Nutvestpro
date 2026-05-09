"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { FileText, Scale, CreditCard, Truck, RotateCcw, Copyright, AlertTriangle, Mail, ArrowLeft, RefreshCw } from "lucide-react";

const sections = [
  {
    icon: FileText,
    title: "1. Acceptance of Terms",
    content: [
      "By accessing and using the NutVest website (the \"Service\"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, you are not authorized to use or access the Service. These terms and conditions apply to all visitors, users, and others who access or use NutVest.",
      "NutVest is a premium nuts and dry fruits business based in Bandipora, Kashmir, owned and operated by Mohammad Sayeed. All transactions and interactions through this website are governed by the laws of India. We reserve the right to update or modify these terms at any time without prior notice. Your continued use of the Service after any such changes constitutes your acceptance of the new terms.",
    ],
  },
  {
    icon: Scale,
    title: "2. Products & Pricing",
    content: [
      "All product descriptions, images, and prices displayed on our website are subject to change without prior notice. While we make every effort to display product colors and images as accurately as possible, we cannot guarantee that your computer monitor's display of any color will be accurate. Product images are for illustrative purposes and actual products may vary slightly in appearance.",
      "All prices are displayed in Indian Rupees (Rs) and are inclusive of applicable taxes unless otherwise stated. Prices do not include delivery charges, which are calculated separately and displayed at checkout. We reserve the right to modify or discontinue any product without notice and shall not be liable to you or any third party for any modification, price change, suspension, or discontinuance of a product.",
      "In the event of a pricing error, we reserve the right to cancel any orders placed for the incorrectly priced product. We will notify you of such cancellation and, if payment has already been processed, issue a full refund promptly.",
    ],
  },
  {
    icon: CreditCard,
    title: "3. Orders & Payment",
    content: [
      "When you place an order through our website, it is redirected to WhatsApp for confirmation and processing. This means your order is considered a request and not a confirmed purchase until it is verified and confirmed by our team via WhatsApp. We reserve the right to refuse or cancel any order for any reason, including but not limited to product availability, errors in pricing or product information, or suspected fraudulent activity.",
      "Payment terms and methods will be communicated to you via WhatsApp when your order is confirmed. We currently accept payments through various methods including UPI, bank transfer, and cash on delivery for select locations within India. All payments must be made in Indian Rupees (Rs).",
      "By placing an order, you represent that the products ordered will be used only in a lawful manner and in accordance with all applicable laws and regulations. You are responsible for providing accurate and complete contact and delivery information. We are not responsible for delays or failures in delivery resulting from incorrect or incomplete information provided by you.",
    ],
  },
  {
    icon: Truck,
    title: "4. Shipping & Delivery",
    content: [
      "We ship our products across India. Delivery times vary depending on your location, typically ranging from 3 to 7 business days from the date of order confirmation. Free shipping is available on orders above Rs 999. For orders below Rs 999, a flat shipping fee of Rs 99 applies.",
      "All products are carefully packed and dispatched from our facility in Bandipora, Kashmir. We partner with reputable courier services to ensure safe and timely delivery. Once your order is dispatched, you will receive tracking information via WhatsApp. We are not responsible for delays caused by courier services, natural calamities, public holidays, or other circumstances beyond our control.",
      "Risk of loss and title for items purchased from us pass to you upon delivery of the items to the carrier. We are not liable for any damage or loss that occurs during transit, though we will assist you in filing claims with the carrier where applicable. Delivery to certain remote locations may take longer than the standard delivery timeframe.",
    ],
  },
  {
    icon: RotateCcw,
    title: "5. Returns & Refunds",
    content: [
      "We take great care in ensuring the quality, freshness, and integrity of our products. Due to the perishable nature of nuts and dry fruits, returns are not accepted for reasons other than quality issues or damage during transit. If you receive a damaged, defective, or incorrect product, please contact us within 48 hours of delivery via WhatsApp at +91 88996 97765 with photographic evidence.",
      "Upon verification of your claim, we will arrange a replacement or issue a refund at our discretion. Refunds, if approved, will be processed within 7-10 business days and will be credited to the original payment method. Shipping charges are non-refundable unless the return is due to an error on our part.",
      "We reserve the right to reject return requests that are made after the 48-hour window, lack sufficient photographic evidence, or involve products that have been opened, consumed, or altered from their original condition. Our decision regarding returns and refunds is final and binding.",
    ],
  },
  {
    icon: Copyright,
    title: "6. Intellectual Property",
    content: [
      "All content on this website, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, is the exclusive property of NutVest or its content suppliers and is protected by Indian and international copyright, trademark, and other intellectual property laws.",
      "Any unauthorized use, reproduction, modification, distribution, transmission, display, performance, or creation of derivative works from the content on this website is strictly prohibited. You may not use any meta tags or any hidden text using NutVest trademarks or product names without our written consent. All trademarks not owned by NutVest that appear on this site are the property of their respective owners.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "7. Limitation of Liability",
    content: [
      "To the fullest extent permitted by applicable law, NutVest shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of or inability to use the Service, any unauthorized access to or use of our servers or personal information, or any interruption or cessation of transmission to or from the Service.",
      "Our total liability for any claim arising from or related to the Service or products shall not exceed the amount you paid for the specific product giving rise to the claim. This limitation of liability applies whether the alleged liability is based on contract, tort, negligence, strict liability, or any other basis, even if NutVest has been advised of the possibility of such damage.",
    ],
  },
  {
    icon: RefreshCw,
    title: "8. Changes to Terms",
    content: [
      "We reserve the right to modify or replace these terms at any time at our sole discretion. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.",
    ],
  },
  {
    icon: Mail,
    title: "9. Contact Information",
    content: [
      "For any questions, concerns, or disputes regarding these Terms and Conditions, please contact us using the information provided below. We encourage you to reach out before taking any legal action, as we are committed to resolving issues amicably and promptly.",
    ],
  },
];

export default function TermsPage() {
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
              <FileText className="w-6 h-6 text-amber-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Terms &amp; <span className="gold-gradient">Conditions</span>
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
            These Terms and Conditions govern your use of the NutVest website and the purchase of products through our Service. By accessing or using our website, you agree to be bound by these terms. Please read them carefully before making any purchase. If you have any questions, please contact us before proceeding.
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
            {section.title === "9. Contact Information" && (
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
