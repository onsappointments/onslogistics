"use client";

import { useEffect } from "react";

export default function LiveChat() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Prevent multiple injections
    if (window.Tawk_API) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/694148d0de3785197bbfa03f/1jcjg8sia";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    document.body.appendChild(script);
  }, []);

  return null;
}
