// components/resources/TableOfContents.jsx
"use client";

import { useEffect, useState } from "react";

export default function TableOfContents({ toc }) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const handler = () => {
      const headings = toc.map((t) =>
        document.getElementById(t.id)
      );

      let current = "";

      headings.forEach((el) => {
        if (!el) return;

        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) {
          current = el.id;
        }
      });

      setActive(current);
    };

    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [toc]);

  return (
    <div className="sticky top-24">
      <h4 className="font-semibold mb-3">
        Contents
      </h4>

      <ul className="space-y-2 text-sm">
        {toc.map((item) => (
          <li
            key={item.id}
            className={`cursor-pointer transition ${
              active === item.id
                ? "text-blue-600 font-medium"
                : "text-gray-500"
            }`}
            style={{
              paddingLeft: item.level === 3 ? "12px" : "0px",
            }}
          >
            <a href={`#${item.id}`}>
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}