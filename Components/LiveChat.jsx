"use client";

import { useEffect } from "react";

export default function LiveChat() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Prevent multiple injections
    if (document.getElementById("aisensy-wa-widget")) return;

    const script = document.createElement("script");

    script.type = "text/javascript";
    script.src =
      "https://d3mkw6s8thqya7.cloudfront.net/integration-plugin.js";

    script.id = "aisensy-wa-widget";

    // Your widget ID
    script.setAttribute("widget-id", "aab1v3");

    document.body.appendChild(script);
  }, []);

  return null;
}