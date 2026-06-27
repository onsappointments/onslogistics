"use client";

import { motion } from "framer-motion";

import HeroContent from "./HeroContent";
import HeroIllustration from "./HeroIllustration";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white">

      {/* Background */}

      <div className="absolute inset-0">

        {/* Blue Glow */}

        <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-blue-50 blur-3xl opacity-70" />

        {/* Grid */}

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right,#0f172a 1px,transparent 1px),linear-gradient(to bottom,#0f172a 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-6 pt-12 lg:px-8 lg:pt-4 lg:pb-16">

        <div className="grid items-center gap-20 lg:grid-cols-[1.05fr_0.95fr]">

          {/* Left */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <HeroContent />
          </motion.div>

          {/* Right */}

          <motion.div
            initial={{
              opacity: 0,
              x: 40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.2,
            }}
            className="flex justify-center lg:justify-end"
          >
            <HeroIllustration />
          </motion.div>

        </div>

      </div>

    </section>
  );
}