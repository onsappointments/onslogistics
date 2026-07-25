"use client";

import SectionHeader from "./SectionHeader";
import KnowledgeGrid from "./KnowledgeGrid";
import TopicChips from "./TopicChips";
import StatsStrip from "./StatsStrip";
import BottomCTA from "./BottomCTA";

export default function KnowledgeHubGateway() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-24 lg:py-32">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-0 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-[28rem] w-[28rem] rounded-full bg-cyan-100/40 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-indigo-100/30 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <SectionHeader />

        {/* Knowledge Cards */}
        <div className="mt-10">
          <KnowledgeGrid />
        </div>

        {/* Popular Topics */}
        <div className="mt-10">
          <TopicChips />
        </div>

        {/* Authority / Stats */}
        <div className="mt-10">
          <StatsStrip />
        </div>

        {/* Final CTA */}
        <div className="mt-10">
          <BottomCTA />
        </div>
      </div>
    </section>
  );
}