import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title");

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#2563eb",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          fontSize: 48,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {title}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}