import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const title =
    searchParams.get("title") || "ONS Logistics";

  const category =
    searchParams.get("category") ||
    "Logistics Guide";

  const shortTitle =
    title.length > 85
      ? title.slice(0, 85) + "…"
      : title;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          background: "#020617",
          color: "white",
        }}
      >
        {/* LEFT */}
        <div
          style={{
            flex: 1,
            padding: "70px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* TOP */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
            }}
          >
            
            <div
              style={{
                fontSize: "28px",
                fontWeight: 700,
              }}
            >
              ONS Logistics
            </div>
          </div>

          {/* TITLE */}
          <div
            style={{
              fontSize: "58px",
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: "700px",
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
            <div
              style={{
                background:
                  "rgba(59,130,246,0.15)",
                border:
                  "1px solid rgba(59,130,246,0.35)",
                color: "#93c5fd",
                padding: "10px 18px",
                borderRadius: "999px",
                fontSize: "20px",
                fontWeight: 600,
              }}
            >
              {category}
            </div>

            <div
              style={{
                fontSize: "18px",
                opacity: 0.6,
              }}
            >
              onslog.com
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div
          style={{
            width: "420px",
            height: "100%",
            position: "relative",
            background:
              "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            overflow: "hidden",
          }}
        >
          {/* GRID */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />

          {/* CIRCLE 1 */}
          <div
            style={{
              position: "absolute",
              width: "320px",
              height: "320px",
              borderRadius: "999px",
              background:
                "rgba(255,255,255,0.12)",
              top: "80px",
              left: "50px",
            }}
          />

          {/* CIRCLE 2 */}
          <div
            style={{
              position: "absolute",
              width: "160px",
              height: "160px",
              borderRadius: "999px",
              background:
                "rgba(255,255,255,0.10)",
              bottom: "80px",
              right: "40px",
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