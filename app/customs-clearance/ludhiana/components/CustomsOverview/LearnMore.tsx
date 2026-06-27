import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Props {
  href: string;
}

export default function LearnMore({
  href,
}: Props) {
  return (
    <Link
      href={href}
      className="
      inline-flex
      items-center
      gap-2
      font-semibold
      text-blue-700
      transition-all
      duration-200
      hover:gap-3
    "
    >
      Learn More

      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}