import { useState, useEffect } from "react";

const FONT = "'DM Sans', -apple-system, system-ui, sans-serif";
const FONT_DISPLAY = "'DM Serif Display', Georgia, ui-serif, serif";

export default function RecommendationModal({
  isOpen,
  onClose,
  recommendations,
  onAddClaim,
  t,
  L,
  isBM,
  theme,
  wide,
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Simulate recommendation generation delay
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isEmpty = recommendations.length === 0;
  const n = (item) => (isBM ? item.reliefNameBM : item.reliefName);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 600,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: wide ? "center" : "flex-end",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
        animation: "fadein 0.2s",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.bg,
          borderRadius: wide ? 20 : "24px 24px 0 0",
          width: "100%",
          maxWidth: wide ? 600 : 480,
          maxHeight: wide ? "85vh" : "90vh",
          padding: wide ? "28px" : "20px",
          fontFamily: FONT,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: wide ? "fadein 0.2s" : "slideup 0.25s ease-out",
          boxShadow: wide ? "0 20px 60px rgba(0,0,0,0.25)" : "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar for mobile */}
        {!wide && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 40,
                height: 4,
                background: theme.hairStrong,
                borderRadius: 2,
              }}
            />
          </div>
        )}

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontSize: 24,
              }}
            >
              💡
            </span>
            <div>
              <div
                style={{
                  fontSize: wide ? 18 : 16,
                  fontWeight: 700,
                  color: theme.ink,
                  lineHeight: 1.2,
                }}
              >
                {isBM ? "Cadangan Pelepasan" : "Relief Recommendations"}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: theme.inkMute,
                  marginTop: 2,
                }}
              >
                {isBM
                  ? "Pelepasan yang mungkin anda terlewatkan"
                  : "Reliefs you might have missed"}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              color: theme.inkMute,
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Content - Scrollable */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            marginBottom: 16,
            paddingRight: 8,
          }}
        >
          {loading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  border: `3px solid ${theme.hair}`,
                  borderTop: `3px solid ${theme.red}`,
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <div
                style={{
                  fontSize: 14,
                  color: theme.inkMute,
                }}
              >
                {isBM ? "Menganalisis pelepasan..." : "Analyzing reliefs..."}
              </div>
            </div>
          ) : isEmpty ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 12,
                textAlign: "center",
                padding: "20px",
              }}
            >
              <span style={{ fontSize: 32 }}>✓</span>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: theme.ink,
                }}
              >
                {isBM ? "Semua pelepasan diklaimed" : "All reliefs claimed!"}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: theme.inkMute,
                  lineHeight: 1.5,
                }}
              >
                {isBM
                  ? "Anda sudah menuntut semua pelepasan yang tersedia. Kerja bagus!"
                  : "You've claimed all available reliefs. Great work!"}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {recommendations.map((rec, idx) => (
                <div
                  key={rec.reliefId}
                  style={{
                    border: `1px solid ${theme.hair}`,
                    borderRadius: 12,
                    padding: "14px 14px",
                    background: rec.isNew ? theme.redSoft : theme.surface,
                    transition: "box-shadow 0.15s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    wide &&
                    (e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(0,0,0,0.08)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = "none")
                  }
                >
                  {/* Rank badge + Name */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: theme.red,
                        minWidth: 24,
                      }}
                    >
                      {idx === 0 ? "🏆" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}`}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: theme.ink,
                          lineHeight: 1.2,
                        }}
                      >
                        {n(rec)}
                      </div>
                      {rec.isNew && (
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            color: theme.red,
                            background: theme.redSoft,
                            padding: "2px 6px",
                            borderRadius: 4,
                            marginTop: 4,
                            display: "inline-block",
                          }}
                        >
                          NEW 2026
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Potential Savings */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: 8,
                      paddingBottom: 8,
                      borderBottom: `1px solid ${theme.hair}`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: theme.inkMute,
                      }}
                    >
                      {isBM ? "Simpanan Cukai Berpotensi:" : "Potential Tax Savings:"}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT_DISPLAY,
                        fontSize: 16,
                        fontWeight: 700,
                        color: theme.red,
                      }}
                    >
                      RM {rec.potentialSavings.toLocaleString()}
                    </span>
                  </div>

                  {/* Why */}
                  <div
                    style={{
                      fontSize: 12,
                      color: theme.inkSoft,
                      lineHeight: 1.4,
                      marginBottom: 10,
                    }}
                  >
                    <span style={{ fontWeight: 600, color: theme.ink }}>
                      {isBM ? "Mengapa:" : "Why:"}
                    </span>{" "}
                    {rec.reason}
                  </div>

                  {/* Add Button */}
                  <button
                    onClick={() => onAddClaim(rec.reliefId)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      background: theme.red,
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: FONT,
                      transition: "opacity 0.15s",
                    }}
                    onMouseEnter={(e) => (e.target.style.opacity = "0.9")}
                    onMouseLeave={(e) => (e.target.style.opacity = "1")}
                  >
                    {isBM ? "Tambah Tuntutan" : "Add Claim"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Close button */}
        {!isEmpty && (
          <button
            onClick={onClose}
            style={{
              width: "100%",
              padding: "12px 14px",
              background: theme.surface,
              color: theme.ink,
              border: `1px solid ${theme.hair}`,
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            {isBM ? "Tutup" : "Close"}
          </button>
        )}
      </div>

      <style>{`
        @keyframes fadein {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideup {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
