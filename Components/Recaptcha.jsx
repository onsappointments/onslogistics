"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), { ssr: false });

export default function Recaptcha({ onVerify }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (process.env.RECAPTCHA_SITE_KEY) {
      setReady(true);
    } else {
      console.error("ReCAPTCHA site key is missing!");
    }
  }, []);

  if (!ready) return null;

  return (
    <ReCAPTCHA
      sitekey={process.env.RECAPTCHA_SITE_KEY}
      onChange={onVerify}
    />
  );
}