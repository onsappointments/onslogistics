"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Workflow,
  MessagesSquare,
  Brain,
  CalculatorIcon,
  Box,
  ArrowUpRight,
} from "lucide-react";

const learningItems = [
  {
    num: "02",
    title: "Blogs",
    description:
      "In-depth logistics guides covering shipping, customs, freight forwarding, export processes, documentation, and international trade.",
    href: "#articles",
    icon: BookOpen,
    badge: "Deep Learning",
  },
  {
    num: "01",
    title: "Flowcharts",
    description:
      "Visualise complex logistics systems through expandable process maps, customs workflows, and shipping operations.",
    href: "/resources/flowchart",
    icon: Workflow,
    badge: "Interactive",
    featured: true,

  },
  {
    num: "03",
    title: "FAQs",
    description:
      "Quick answers to common logistics, customs clearance, freight forwarding, and import-export questions.",
    href: "/resources/faq",
    icon: MessagesSquare,
    badge: "Quick Answers",
  },
  {
    num: "04",
    title: "Flashcards",
    description:
      "Master logistics vocabulary and concepts through interactive flashcards built for fast retention.",
    href: "/resources/flashcards",
    icon: Brain,
    badge: "Micro Learning",
  },
];

const BLUE = "#2563eb";
const NAVY = "#0d1b36";
const SLATE = "#64748b";
const LIGHT_BG = "#f8fafc";
const BORDER = "#e2e8f0";

function FeaturedCard({ item }) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  return (
    <motion.a
      href={item.href}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: NAVY,
        borderRadius: 28,
        padding: "40px 36px",
        textDecoration: "none",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        minHeight: 500,
        transition: "transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 24px 60px rgba(13,27,54,0.28)"
          : "0 4px 24px rgba(13,27,54,0.12)",
      }}
    >
      {/* Ghost number */}
      <span
        style={{
          position: "absolute",
          bottom: -30,
          right: -16,
          fontSize: 200,
          fontWeight: 800,
          fontFamily: "'DM Serif Display', serif",
          color: "rgba(37,99,235,0.10)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          letterSpacing: "-0.05em",
        }}
      >
        01
      </span>

      {/* Glint top-right */}
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Top section */}
      <div>
        {/* Icon */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            background: BLUE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
            boxShadow: "0 8px 20px rgba(37,99,235,0.4)",
            transition: "transform 0.3s ease",
            transform: hovered ? "scale(1.08)" : "scale(1)",
          }}
        >
          <Icon size={26} color="white" strokeWidth={1.75} />
        </div>

        {/* Badge */}
        <span
          style={{
            display: "inline-block",
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: BLUE,
            fontWeight: 700,
            background: "rgba(37,99,235,0.14)",
            padding: "5px 14px",
            borderRadius: 100,
            marginBottom: 20,
          }}
        >
          {item.badge}
        </span>

        <h3
          style={{
            fontSize: 34,
            color: "white",
            margin: "0 0 16px",
            fontFamily: "'DM Serif Display', serif",
            lineHeight: 1.15,
            fontWeight: 400,
          }}
        >
          {item.title}
        </h3>
        <p
          style={{
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.75,
            fontSize: 15,
            margin: 0,
            maxWidth: 320,
          }}
        >
          {item.description}
        </p>
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 36,
          paddingTop: 28,
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "white",
            letterSpacing: "0.01em",
          }}
        >
          Explore Guides
        </span>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: BLUE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            transform: hovered ? "rotate(-45deg) scale(1.1)" : "rotate(0deg)",
            boxShadow: hovered ? "0 6px 18px rgba(37,99,235,0.5)" : "none",
          }}
        >
          <ArrowUpRight size={20} color="white" strokeWidth={2} />
        </div>
      </div>

      {/* Animated bottom line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: BLUE,
          transformOrigin: "left",
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 0.45s cubic-bezier(.22,1,.36,1)",
          borderRadius: "0 3px 3px 0",
        }}
      />
    </motion.a>
  );
}

function SecondaryCard({ item, index }) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  return (
    <motion.a
      href={item.href}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "white",
        border: `1px solid ${hovered ? "rgba(37,99,235,0.25)" : BORDER}`,
        borderRadius: 24,
        padding: "28px 26px",
        textDecoration: "none",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        transition:
          "transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease, border-color 0.2s ease",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 16px 40px rgba(37,99,235,0.1)"
          : "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {/* Ghost number */}
      <span
        style={{
          position: "absolute",
          top: -14,
          right: 4,
          fontSize: 88,
          fontWeight: 800,
          fontFamily: "'DM Serif Display', serif",
          color: hovered ? "rgba(37,99,235,0.07)" : "rgba(0,0,0,0.04)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          transition: "color 0.3s ease",
          letterSpacing: "-0.03em",
        }}
      >
        {item.num}
      </span>

      {/* Icon row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: hovered ? BLUE : LIGHT_BG,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.3s ease, box-shadow 0.3s ease",
            boxShadow: hovered ? "0 6px 16px rgba(37,99,235,0.35)" : "none",
          }}
        >
          <Icon
            size={22}
            color={hovered ? "white" : "#475569"}
            strokeWidth={1.75}
            style={{ transition: "color 0.3s ease" }}
          />
        </div>

        <span
          style={{
            fontSize: 10.5,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: SLATE,
            fontWeight: 700,
            background: LIGHT_BG,
            border: `1px solid ${BORDER}`,
            padding: "4px 11px",
            borderRadius: 100,
          }}
        >
          {item.badge}
        </span>
      </div>

      {/* Content */}
      <h3
        style={{
          fontSize: 17,
          color: NAVY,
          margin: "0 0 10px",
          fontWeight: 700,
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
        }}
      >
        {item.title}
      </h3>
      <p
        style={{
          color: SLATE,
          lineHeight: 1.65,
          fontSize: 13.5,
          margin: 0,
          flex: 1,
        }}
      >
        {item.description}
      </p>

      {/* CTA */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          marginTop: 22,
          color: BLUE,
          fontWeight: 700,
          fontSize: 13,
        }}
      >
        <span>Explore</span>
        <ArrowUpRight
          size={15}
          strokeWidth={2.5}
          style={{
            transition: "transform 0.2s ease",
            transform: hovered ? "translate(2px, -2px)" : "translate(0,0)",
          }}
        />
      </div>

      {/* Hover accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: BLUE,
          transformOrigin: "left",
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 0.4s cubic-bezier(.22,1,.36,1)",
          borderRadius: "0 3px 3px 0",
        }}
      />
    </motion.a>
  );
}

export default function LearningPaths() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const featured = learningItems[1];
  const rest = learningItems.slice(0, 1).concat(learningItems.slice(2));

  return (
    <section
      style={{
        position: "relative",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* Dot-grid background */}
      <div
        style={{
          position: "absolute",
          inset: "-40px -60px",
          backgroundImage:
            "radial-gradient(circle, rgba(37,99,235,0.08) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
          zIndex: 0,
          borderRadius: 40,
        }}
      />

      {/* Content wrapper */}
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── Section header ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            marginBottom: 44,
          }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}
          >
            <div
              style={{ width: 36, height: 2, background: BLUE, borderRadius: 2 }}
            />
            <span
              style={{
                fontSize: 11.5,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: BLUE,
                fontWeight: 700,
              }}
            >
              Logistics Learning Hub
            </span>
          </motion.div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(2.1rem, 4.5vw, 3.4rem)",
                lineHeight: 1.08,
                color: NAVY,
                margin: 0,
                fontWeight: 400,
                letterSpacing: "-0.01em",
              }}
            >
              Learn Logistics,{" "}
              <em style={{ color: BLUE, fontStyle: "italic" }}>your way</em>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.12 }}
              style={{
                maxWidth: 380,
                color: SLATE,
                lineHeight: 1.75,
                fontSize: 15,
                margin: 0,
              }}
            >
              Explore in the format that works best for you — from deep-dive
              guides to interactive maps and instant answers.
            </motion.p>
          </div>
        </div>

        {/* ── Card grid ── */}
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "stretch",
          }}
        >
          {/* Featured — left */}
          <div style={{ flex: "0 0 340px", minWidth: 0 }}>
            <FeaturedCard item={featured} />
          </div>

          {/* 2×2 grid — right */}
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              gap: 16,
              minWidth: 0,
            }}
          >
            {rest.map((item, i) => (
              <SecondaryCard key={item.num} item={item} index={i} />
            ))}
          </div>
        </div>

        {/* ── Footer stat bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.3 }}
          style={{
            marginTop: 20,
            borderRadius: 20,
            background: "white",
            border: `1px solid ${BORDER}`,
            padding: "18px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          {[
            { val: "4", label: "Learning formats" },
            { val: "100+", label: "Logistics guides" },
            { val: "Free", label: "Always & forever" },
            { val: "India-focused", label: "Import & export coverage" },
          ].map((stat, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {i > 0 && (
                <div
                  style={{
                    width: 1,
                    height: 28,
                    background: BORDER,
                    marginRight: 12,
                  }}
                />
              )}
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: NAVY,
                  letterSpacing: "-0.02em",
                }}
              >
                {stat.val}
              </span>
              <span style={{ fontSize: 13, color: SLATE, fontWeight: 500 }}>
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}