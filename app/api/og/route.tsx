import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "1200px",
          height: "630px",
          backgroundColor: "#0f172a",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "1080px",
            height: "510px",
            backgroundColor: "#1e293b",
            borderRadius: "24px",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "48px",
                height: "48px",
                backgroundColor: "#2563eb",
                borderRadius: "10px",
                color: "white",
                fontSize: "22px",
                fontWeight: 700,
              }}
            >
              AI
            </div>
            <span style={{ color: "white", fontSize: "24px", fontWeight: 600 }}>
              Birmingham AI
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              color: "white",
              fontSize: "72px",
              fontWeight: 700,
              margin: "0 0 16px 0",
            }}
          >
            AEO Scanner
          </h1>

          {/* Subtitle */}
          <p
            style={{
              color: "#94a3b8",
              fontSize: "26px",
              margin: "0 0 40px 0",
            }}
          >
            Is your website visible to AI search engines?
          </p>

          {/* CTA button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#2563eb",
              borderRadius: "12px",
              padding: "14px 48px",
            }}
          >
            <span
              style={{ color: "white", fontSize: "22px", fontWeight: 600 }}
            >
              Scan Your Site Free
            </span>
          </div>

          {/* Tagline */}
          <p
            style={{
              color: "#64748b",
              fontSize: "16px",
              marginTop: "40px",
            }}
          >
            Answer Engine Optimization for the AI search era
          </p>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
