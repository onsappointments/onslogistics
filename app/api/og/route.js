import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get("title") || "ONS Logistics";
  const category = searchParams.get("category") || "Logistics Guide";

  const shortTitle =
    title.length > 85 ? title.slice(0, 85) + "…" : title;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          background: "#020617", // deeper dark
          fontFamily: "Inter",
          color: "white",
        }}
      >
        {/* LEFT SIDE */}
        <div
          style={{
            flex: 1,
            padding: "70px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* BRAND */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#3b82f6",
              }}
            />
            <div style={{ fontSize: 24, opacity: 0.85 }}>
              ONS Logistics
            </div>
          </div>

          {/* TITLE */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: 720,
              letterSpacing: "-1px",
            }}
          >
            {shortTitle}
          </div>

          {/* FOOTER */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* CATEGORY */}
            <div
              style={{
                background: "rgba(59,130,246,0.15)",
                color: "#93c5fd",
                padding: "10px 18px",
                borderRadius: 999,
                fontSize: 20,
                border: "1px solid rgba(59,130,246,0.3)",
              }}
            >
              {category}
            </div>

            {/* DOMAIN */}
            <div style={{ fontSize: 18, opacity: 0.6 }}>
              onslog.com
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          style={{
            width: 420,
            height: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* GRADIENT BASE */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, #2563eb, #1e40af)",
            }}
          />

          {/* GRID OVERLAY */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* GLOW CORE */}
          <div
            style={{
              position: "absolute",
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              top: 80,
              left: 60,
              filter: "blur(100px)",
            }}
          />

          {/* ACCENT LINE */}
          <div
            style={{
              position: "absolute",
              bottom: 60,
              left: 40,
              right: 40,
              height: 2,
              background: "rgba(255,255,255,0.2)",
            }}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}