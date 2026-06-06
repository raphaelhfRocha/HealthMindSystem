import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeartECGIcon = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="40" fill="url(#headGrad)" />
    <defs>
      <linearGradient id="headGrad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4FC3A1" />
        <stop offset="100%" stopColor="#1A7A5E" />
      </linearGradient>
      <linearGradient id="heartGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6EE7C7" />
        <stop offset="100%" stopColor="#1D9E75" />
      </linearGradient>
    </defs>
    <ellipse cx="40" cy="32" rx="14" ry="17" fill="white" fillOpacity="0.15" />
    <rect x="33" y="46" width="14" height="10" rx="3" fill="white" fillOpacity="0.15" />
    <path
      d="M40 52 C40 52 26 43 26 34 C26 29 30 26 34 26 C36.5 26 38.5 27.5 40 29 C41.5 27.5 43.5 26 46 26 C50 26 54 29 54 34 C54 43 40 52 40 52Z"
      fill="url(#heartGrad)"
      fillOpacity="0.9"
    />
    <polyline
      points="28,35 33,35 35,29 37,41 39,32 41,38 43,35 52,35"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle cx="56" cy="24" r="2" fill="white" fillOpacity="0.8" />
    <circle cx="60" cy="30" r="1.5" fill="white" fillOpacity="0.6" />
    <circle cx="52" cy="20" r="1" fill="white" fillOpacity="0.5" />
  </svg>
);

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/home");
    }, 1000);
  };

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', sans-serif",
      background: "#e0e0e0",
    }}>
      {/* Left sidebar */}
      <div style={{
        width: "160px",
        minHeight: "100vh",
        background: "#1A4FA3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: "100px",
          color: "#7A8EBA",
          fontWeight: "bold",
          userSelect: "none",
          lineHeight: 1,
          fontFamily: "Georgia, serif",
        }}>Ψ</span>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}>
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "2.5rem 3rem",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          {/* Logo */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "2rem",
          }}>
            <HeartECGIcon />
            <div>
              <div style={{ fontSize: "32px", fontWeight: "700", lineHeight: 1.1, color: "#1A4FA3" }}>Health</div>
              <div style={{ fontSize: "32px", fontWeight: "700", lineHeight: 1.1, color: "#3BB077" }}>Mind</div>
            </div>
          </div>

          {/* Form */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <label style={{ fontSize: "15px", fontWeight: "500", color: "#333", minWidth: "48px" }}>Login</label>
              <input
                type="text"
                value={login}
                onChange={e => setLogin(e.target.value)}
                style={{
                  flex: 1, height: "38px", border: "none", borderRadius: "8px",
                  background: "#D9D9D9", padding: "0 14px", fontSize: "14px", outline: "none", color: "#333",
                }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <label style={{ fontSize: "15px", fontWeight: "500", color: "#333", minWidth: "48px" }}>Senha</label>
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                style={{
                  flex: 1, height: "38px", border: "none", borderRadius: "8px",
                  background: "#D9D9D9", padding: "0 14px", fontSize: "14px", outline: "none", color: "#333",
                }}
              />
            </div>

            <div style={{ textAlign: "right", marginTop: "-8px" }}>
            </div>

            <button
              onClick={handleSubmit}
              style={{
                width: "100%", height: "42px", background: "#1A4FA3", color: "white",
                border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "600",
                cursor: "pointer", marginTop: "4px", transition: "opacity 0.2s",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}