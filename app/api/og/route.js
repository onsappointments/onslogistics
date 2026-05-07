return new ImageResponse(
  (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        background: "#020617",
        color: "white",
      }}
    >
      {/* LEFT */}
      <div
        style={{
          flex: 1,
          padding: 70,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* BRAND */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          {/* LOGO */}
          <img
            src="https://onslog.com/logo.png"
            width="52"
            height="52"
            style={{
              borderRadius: 999,
            }}
          />

          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              opacity: 0.95,
            }}
          >
            ONS Logistics
          </div>
        </div>

        {/* TITLE */}
        <div
          style={{
            fontSize: 58,
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: 700,
            letterSpacing: -2,
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
              background: "rgba(59,130,246,0.15)",
              border: "1px solid rgba(59,130,246,0.35)",
              color: "#93c5fd",
              padding: "10px 18px",
              borderRadius: 999,
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            {category}
          </div>

          <div
            style={{
              fontSize: 18,
              opacity: 0.6,
            }}
          >
            onslog.com
          </div>
        </div>
      </div>

      {/* RIGHT VISUAL */}
      <div
        style={{
          width: 420,
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

        {/* LARGE CIRCLE */}
        <div
          style={{
            position: "absolute",
            width: 320,
            height: 320,
            borderRadius: 999,
            background: "rgba(255,255,255,0.12)",
            top: 80,
            left: 50,
          }}
        />

        {/* SMALL CIRCLE */}
        <div
          style={{
            position: "absolute",
            width: 160,
            height: 160,
            borderRadius: 999,
            background: "rgba(255,255,255,0.10)",
            bottom: 80,
            right: 40,
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
            background: "rgba(255,255,255,0.25)",
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