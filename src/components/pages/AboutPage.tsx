"use client";

import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import {
  Award,
  Leaf,
  Truck,
  Shield,
  Users,
  Heart,
  Gem,
  Handshake,
  Globe,
  Target,
  Eye,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";

const values = [
  {
    icon: Gem,
    title: "Uncompromising Quality",
    desc: "We never compromise on the caliber of our products. Every nut, every saffron strand, every dry fruit passes through rigorous quality checks before reaching you.",
  },
  {
    icon: Handshake,
    title: "Honest Trade",
    desc: "Fair pricing, transparent sourcing, and genuine products. We build relationships on trust, not shortcuts. What you see is exactly what you get.",
  },
  {
    icon: Leaf,
    title: "Natural Purity",
    desc: "No preservatives, no artificial additives, no chemical treatments. Our products are as nature intended — pure, wholesome, and straight from the source.",
  },
  {
    icon: Globe,
    title: "Sustainable Sourcing",
    desc: "We work directly with local farmers and cooperatives in Kashmir, ensuring sustainable harvesting practices that protect the land for future generations.",
  },
];

const whyChooseUs = [
  {
    icon: Award,
    title: "Handpicked Selection",
    desc: "Every batch is hand-inspected for size, color, aroma, and quality. Only the top grade makes it to our inventory — the rest never leaves the facility.",
  },
  {
    icon: Leaf,
    title: "100% Natural Processing",
    desc: "Zero artificial colors, flavors, or preservatives. Our processing methods preserve the natural integrity, taste, and nutritional value of every product.",
  },
  {
    icon: Shield,
    title: "FSSAI Certified",
    desc: "Fully compliant with FSSAI standards. Every product is lab-tested for purity, safety, and authenticity before it is packaged and shipped.",
  },
  {
    icon: Truck,
    title: "Freshness Guaranteed",
    desc: "Vacuum-sealed packaging locks in freshness from our facility in Bandipora. Delivered to your doorstep within 3-5 business days across India.",
  },
  {
    icon: Users,
    title: "Direct from Source",
    desc: "No middlemen, no markups. We source directly from Kashmiri farmers and trusted international growers, ensuring authenticity and fair pricing.",
  },
  {
    icon: Heart,
    title: "Customer-First Approach",
    desc: "From product inquiries to post-delivery support, our commitment to your satisfaction is unwavering. Every interaction is handled with care and professionalism.",
  },
];

const kashmirProducts = [
  {
    title: "Kashmiri Saffron",
    desc: "Hand-harvested from the crocus fields of Pampore, our saffron is the world's finest — rich in aroma, color, and flavor that defines authentic Kashmiri cuisine.",
  },
  {
    title: "Walnuts of Kashmir",
    desc: "Grown in the orchards of Bandipora and surrounding valleys, our walnuts are naturally rich in omega-3 fatty acids and carry the distinct taste of Kashmir's pristine environment.",
  },
  {
    title: "Almonds from the Hills",
    desc: "Sourced from the foothills of the Himalayas, our almonds are sun-dried and hand-selected to ensure only the premium quality reaches your home.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutPage() {
  const { navigate } = useStore();

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">
            Our Story
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mt-3 mb-4">
            About <span className="gold-gradient">NutVest</span>
          </h1>
          <p className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed">
            Born from a passion for quality, NutVest brings the finest nuts
            and dry fruits from the valleys of Kashmir directly to your
            doorstep.
          </p>
        </motion.div>

        {/* Founder Story with Owner Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="glass-card p-8 sm:p-12 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                The Vision of{" "}
                <span className="gold-gradient">Mohammad Sayeed</span>
              </h2>
              <p className="text-white/60 leading-relaxed mb-4">
                NutVest was founded by Mohammad Sayeed in the beautiful valley
                of Bandipora, Kashmir, with a simple yet powerful vision — to
                make premium quality nuts and dry fruits accessible to everyone,
                without compromise.
              </p>
              <p className="text-white/60 leading-relaxed mb-4">
                Growing up surrounded by the rich traditions of Kashmiri cuisine,
                Sayeed understood that the secret to great food lies in the
                quality of its ingredients. He noticed a gap in the market —
                while nuts and dry fruits were widely available, truly premium
                quality products sourced directly from Kashmir were hard to find.
              </p>
              <p className="text-white/60 leading-relaxed">
                Thus, NutVest was born — a brand committed to sourcing the
                finest almonds, saffron, walnuts, and dry fruits from
                Kashmir&apos;s pristine valleys, alongside the best cashews from Goa
                and pistachios from Iran, bringing together the world&apos;s best
                under one roof.
              </p>
            </div>
            <div className="glass-liquid rounded-2xl p-6 text-center">
              <div className="relative w-36 h-36 mx-auto mb-5 rounded-full overflow-hidden ring-4 ring-amber-600/30">
                <Image
                  src="/owner.jpg"
                  alt="Mohammad Sayeed - Founder and CEO of NutVest"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <h3 className="text-white font-bold text-xl">
                Mohammad Sayeed
              </h3>
              <p className="text-amber-400 text-sm mt-1 font-medium">
                Founder and CEO
              </p>
              <p className="text-white/40 text-xs mt-1">
                Bandipora, Kashmir
              </p>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-white/50 text-sm italic leading-relaxed">
                  &ldquo;Quality is not an act, it is a habit. Every nut we sell
                  carries our promise of excellence.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mission and Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="glass-card p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-amber-600/15 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Our Mission</h3>
            </div>
            <p className="text-white/60 leading-relaxed">
              To deliver the highest quality nuts and dry fruits to every
              household, ensuring freshness, authenticity, and taste in every
              bite. Rooted in the valleys of Kashmir, we believe everyone
              deserves access to premium nutrition sourced directly from
              nature&apos;s finest orchards.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="glass-card p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-amber-600/15 flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Our Vision</h3>
            </div>
            <p className="text-white/60 leading-relaxed">
              To become India&apos;s most trusted brand for premium nuts and dry
              fruits, known for uncompromising quality, sustainable sourcing, and
              customer delight. We aspire to make healthy eating a joyful
              experience, starting from our home in Bandipora, Kashmir.
            </p>
          </motion.div>
        </div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="glass-card p-8 sm:p-12 mb-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Our Core <span className="gold-gradient">Values</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              The principles that guide every decision we make, every product we
              source, and every relationship we build.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((item) => (
              <div
                key={item.title}
                className="glass-liquid rounded-xl p-5 flex gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-600/15 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Kashmir Heritage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="glass-card p-8 sm:p-12 mb-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              From the{" "}
              <span className="gold-gradient">Valleys of Kashmir</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Nestled in the pristine beauty of Bandipora, our products carry
              the rich heritage and natural purity of Kashmir&apos;s finest
              harvests.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {kashmirProducts.map((item) => (
              <div
                key={item.title}
                className="glass-liquid rounded-xl p-6 text-center"
              >
                <div className="w-10 h-10 rounded-full bg-amber-600/15 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-5 h-5 text-amber-400" />
                </div>
                <h4 className="text-white font-semibold mb-2">
                  {item.title}
                </h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="glass-card p-8 sm:p-12 mb-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Why Choose <span className="gold-gradient">NutVest</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              We do not just sell nuts and dry fruits — we deliver a promise of
              quality, trust, and authenticity with every order.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="glass-liquid rounded-xl p-5 flex gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-600/15 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quality Assurance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="glass-card p-8 sm:p-12 mb-10"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: "100%", label: "Natural Products" },
              { value: "FSSAI", label: "Certified Quality" },
              { value: "3-5", label: "Days Delivery" },
              { value: "10K+", label: "Happy Customers" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-bold gold-gradient mb-1">
                  {stat.value}
                </p>
                <p className="text-white/50 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-white/50 mb-4">
            Ready to taste the difference?
          </p>
          <button
            onClick={() => navigate("/products")}
            className="btn-primary px-8 py-3.5 text-base"
          >
            Explore Our Products
          </button>
          <p className="text-white/25 text-xs mt-8">
            Designed and Developed by{" "}
            <span className="text-amber-400/60 font-semibold">
              Bakshi Faheem
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
