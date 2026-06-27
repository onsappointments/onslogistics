import Hero from "./components/Hero/Hero";

// Existing Components
import CustomsOverview from "./components/CustomsOverview/CustomsOverview";
import Journey from "./components/Journey/Journey";
import Documentation from "./components/Documentation/Documentation";
import Industries from "./components/Industries/Industries";
import Challenges from "./components/Challenges/Challenges";
import ReadyForClearance from "./components/CTA/ReadyForClearance";
import FAQ from "./components/FAQ/FAQ";
import FinalCTA from "./components/CTA/FinalCTA";

// Uncomment later
// import KnowledgeHub from "./components/KnowledgeHub/KnowledgeHub";
// import NearbyInfrastructure from "./components/ICDGuide/ICDGuide";

export default function CustomsClearanceLudhianaPage() {
  return (
    <main className="bg-white">

      {/* Hero */}
      <Hero />

      {/* Customs Overview */}
      <CustomsOverview />

      {/* Customs Journey */}
      <Journey />

      {/* Documentation */}
      <Documentation />

      {/* Industry Expertise */}
      <Industries />

      {/* Customs Challenges */}
      <Challenges />

      {/* Ready CTA */}
      <ReadyForClearance />

      {/* FAQ */}
      <FAQ />

      {/* Knowledge Hub */}
      {/* <KnowledgeHub /> */}

      {/* Final CTA */}
      <FinalCTA />

    </main>
  );
}