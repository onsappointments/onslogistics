import FlashcardCard from "./FlashcardCard";

export default function FlashcardsGrid({
  cards,
}) {
  return (
    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-8
      "
    >

      {cards.map((card) => (

        <FlashcardCard
          key={card.slug}
          card={card}
        />

      ))}

    </div>
  );
}