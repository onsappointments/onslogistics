import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const title =
    searchParams.get("title") || "ONS Logistics";

  const category =
    searchParams.get("category") ||
    "Logistics Guide";

  const description =
    searchParams.get("description") ||
    "Expert insights on customs, freight forwarding, shipping, pricing, and international logistics from India.";

  const readTime =
    searchParams.get("time") || "8 min read";

  const shortTitle =
    title.length > 90
      ? title.slice(0, 90) + "…"
      : title;

  const shortDescription =
    description.length > 150
      ? description.slice(0, 150) + "…"
      : description;

  const visual = new URL(
    "/logo.png",
    req.url
  ).toString();

  // CATEGORY COLORS
  const categoryColors = {
    Customs: "#2563eb",
    Pricing: "#059669",
    Documents: "#7c3aed",
    Comparisons: "#ea580c",
    "Shipping Methods": "#0f766e",
    "India Trade": "#dc2626",
  };

  const accent =
    categoryColors[category] || "#2563eb";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8fafc",
          padding: "36px",
          fontFamily: "sans-serif",
        }}
      >
        {/* MAIN CARD */}
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#ffffff",
            borderRadius: "30px",
            border: "1px solid #e2e8f0",
            display: "flex",
            overflow: "hidden",
            padding: "56px",
          }}
        >
          {/* LEFT CONTENT */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              paddingRight: "42px",
            }}
          >
            {/* TOP META */}
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
                  backgroundColor: "#dbeafe",
                  color: accent,
                  padding: "10px 20px",
                  borderRadius: "999px",
                  fontSize: "22px",
                  fontWeight: 700,
                }}
              >
                {category}
              </div>

              {/* READ TIME */}
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "22px",
                  fontWeight: 500,
                }}
              >
                {readTime}
              </div>
            </div>

            {/* TITLE + DESCRIPTION */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "30px",
              }}
            >
              {/* TITLE */}
              <div
                style={{
                  fontSize: "68px",
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: "-2px",
                  maxWidth: "700px",
                  color: "#0f172a",
                }}
              >
                {shortTitle}
              </div>

              {/* DESCRIPTION */}
              <div
                style={{
                  marginTop: "26px",
                  fontSize: "28px",
                  lineHeight: 1.5,
                  color: "#475569",
                  maxWidth: "680px",
                }}
              >
                {shortDescription}
              </div>
            </div>

            {/* FOOTER */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderTop: "1px solid #e2e8f0",
                paddingTop: "28px",
                marginTop: "24px",
              }}
            >
              <img
                src={visual}
                width="42"
                height="42"
                alt="ONS"
              />

              {/* BRAND */}
              <div
                style={{
                  fontSize: "30px",
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                ONS Logistics
              </div>

              {/* DIVIDER */}
              <div
                style={{
                  width: "2px",
                  height: "28px",
                  backgroundColor: "#e2e8f0",
                  marginLeft: "24px",
                  marginRight: "24px",
                }}
              />

              {/* DOMAIN */}
              <div
                style={{
                  fontSize: "28px",
                  color: "#64748b",
                  fontWeight: 500,
                }}
              >
                onslog.com
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}