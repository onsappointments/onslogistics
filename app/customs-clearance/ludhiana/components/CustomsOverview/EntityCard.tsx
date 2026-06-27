import EntityTag from "./EntityTag";
import ExpertTip from "./ExpertTip";
import CommonMistake from "./CommonMistake";
import LearnMore from "./LearnMore";
import QuickAnswer from "./QuickAnswer";

import { EntityItem } from "./types";

interface Props {
  item: EntityItem;
}

export default function EntityCard({
  item,
}: Props) {
  return (
    <article
      className="
      rounded-[32px]
      border
      border-slate-200
      bg-white
      p-8
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-xl
    "
    >
      <h3 className="text-2xl font-bold text-slate-900">
        {item.title}
      </h3>

      <p className="mt-5 leading-8 text-slate-600">
        {item.description}
      </p>

      <div className="mt-8">
        <QuickAnswer>
          {item.quickAnswer}
        </QuickAnswer>
      </div>

      <div className="mt-5">
        <ExpertTip>
          {item.expertTip}
        </ExpertTip>
      </div>

      <div className="mt-5">
        <CommonMistake>
          {item.commonMistake}
        </CommonMistake>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <EntityTag
            key={tag}
            label={tag}
          />
        ))}
      </div>

      <div className="mt-8">
        <LearnMore href={item.href} />
      </div>
    </article>
  );
}