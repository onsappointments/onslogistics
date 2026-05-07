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
    title.length > 90
      ? title.slice(0, 90) + "…"
      : title;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          backgroundColor: "#020617",
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
            backgroundColor: "#020617",
          }}
        >
          {/* BRAND */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "999px",
                backgroundColor: "#2563eb",
                marginRight: "14px",
              }}
            />

            <div
              style={{
                fontSize: "30px",
                fontWeight: 700,
                color: "#ffffff",
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
              maxWidth: "720px",
              color: "#ffffff",
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
                backgroundColor: "#1e3a8a",
                color: "#dbeafe",
                padding: "12px 20px",
                borderRadius: "999px",
                fontSize: "20px",
                fontWeight: 600,
              }}
            >
              {category}
            </div>

            {/* DOMAIN */}
            <div
              style={{
                fontSize: "18px",
                color: "#94a3b8",
              }}
            >
              onslog.com
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          style={{
            width: "360px",
            height: "100%",
            backgroundColor: "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
          }}
        >
          <div
            style={{
              width: "220px",
              height: "220px",
              borderRadius: "999px",
              backgroundColor: "rgba(255,255,255,0.12)",
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