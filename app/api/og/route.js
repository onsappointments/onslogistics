import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get("title") || "ONS Logistics";
  const category = searchParams.get("category") || "Logistics Guide";

  const shortTitle =
    title.length > 90 ? title.slice(0, 90) + "…" : title;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "row",
          background: "#0f172a", // dark premium base
          fontFamily: "Inter",
        }}
      >
        {/* LEFT SIDE (CONTENT) */}
        <div
          style={{
            flex: 1,
            padding: "60px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "white",
          }}
        >
          {/* BRAND */}
          <div style={{ fontSize: 26, opacity: 0.8 }}>
            ONS Logistics
          </div>

          {/* TITLE */}
          <div
            style={{
              fontSize: 54,
              fontWeight: 700,
              lineHeight: 1.15,
              maxWidth: 700,
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
                background: "rgba(255,255,255,0.08)",
                padding: "10px 18px",
                borderRadius: 999,
                fontSize: 20,
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

        {/* RIGHT SIDE (VISUAL) */}
        <div
          style={{
            width: 400,
            height: "100%",
            position: "relative",
            background:
              "linear-gradient(135deg, #2563eb, #1d4ed8)",
          }}
        >
          {/* SOFT GLOW */}
          <div
            style={{
              position: "absolute",
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              top: 100,
              left: 50,
              filter: "blur(80px)",
            }}
          />

          {/* SECOND GLOW */}
          <div
            style={{
              position: "absolute",
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              bottom: 80,
              right: 40,
              filter: "blur(60px)",
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