import HeroContent from "./HeroContent";
import HeroIllustration from "./HeroIllustration";

export default function Hero({
  content,
  search,
  actions,
  cards,
}) {
  return (
    <section
      aria-labelledby="government-schemes-heading"
      className="relative overflow-hidden bg-white"
    >
      {/* Background */}
      <div
        aria-hidden="true"
        className="
          absolute
          inset-0
          -z-10
          bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.08),transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.05),transparent_35%)]
        "
      />

      <div className="mx-auto max-w-7xl px-6 pt-6 pb-16 lg:px-6 lg:pt-6 lg:pb-24">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">

          <HeroContent
            content={content}
            search={search}
            actions={actions}
          />

          <HeroIllustration cards={cards} />

        </div>
      </div>
    </section>
  );
}