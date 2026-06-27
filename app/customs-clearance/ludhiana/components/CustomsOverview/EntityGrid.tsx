import EntityCard from "./EntityCard";
import { EntityItem } from "./types";

interface EntityGridProps {
  items: EntityItem[];
}

export default function EntityGrid({
  items,
}: EntityGridProps) {
  return (
    <div className="mt-16 space-y-10">
      {items.map((item) => (
        <EntityCard
          key={item.id}
          item={item}
        />
      ))}
    </div>
  );
}