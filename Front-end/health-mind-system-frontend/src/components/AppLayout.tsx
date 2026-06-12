import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../shared/context/AuthContext";
import { usePermissions } from "../shared/hooks/usePermissions";
import { ROLES } from "../shared/constants/roles";

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <line x1="7" y1="3" x2="7" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="17" y1="3" x2="17" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const HistoricoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="3" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="8" y="3" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <line x1="10" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="10" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const ProntuarioIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <line x1="8" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="8" y1="14" x2="16" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="8" y1="18" x2="12" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const PacienteIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M4 20 C4 16 8 13 12 13 C16 13 20 16 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
  </svg>
);

const PsicologoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" fill="none"/>
    <path d="M2 20 C2 16 5 14 9 14 C11 14 13 15 14.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M14 20 C14 17.5 15.5 16 17 16 C18.5 16 20 17.5 20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
  </svg>
);

const RecepcionistaIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="7" r="3.5" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M5 21 C5 17 8 14.5 12 14.5 C16 14.5 19 17 19 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M9 18 L15 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const FinanceiroIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none"/>
    <line x1="12" y1="7" x2="12" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="14" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 13 C10 13 10.5 14 12 14 C13.5 14 14 13 14 12 C14 11 13 10.5 12 10 C11 9.5 10 9 10 8 C10 7 10.5 6 12 6 C13.5 6 14 7 14 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
  </svg>
);

const DisponibilidadesIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none"/>
    <polyline points="12,7 12,12 15,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const DisponibilidadesPsicologosIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none"/>
    <polyline points="12,7 12,12 15,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const PlanoSaudeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 21 C12 21 4 15 4 9 C4 6 6 4 9 4 C10.5 4 11.5 5 12 6 C12.5 5 13.5 4 15 4 C18 4 20 6 20 9 C20 15 12 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"/>
    <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="10" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const AMBOS = [ROLES.PSICOLOGO, ROLES.RECEPCIONISTA];

const navItems = [
  { label: "Home",         Icon: HomeIcon,       path: "/home",            roles: AMBOS },
  { label: "Agendamentos", Icon: CalendarIcon,   path: "/agendamentos/consultar",    roles: [ROLES.PSICOLOGO] },
  { label: "Agendamentos", Icon: CalendarIcon, path: "/agendamentos", roles: [ROLES.RECEPCIONISTA] },
  { label: "Histórico",    Icon: HistoricoIcon,  path: "/historico",       roles: [ROLES.PSICOLOGO] },
  { label: "Prontuário",   Icon: ProntuarioIcon, path: "/prontuario",      roles: [ROLES.PSICOLOGO] },
  { label: "Paciente",     Icon: PacienteIcon,   path: "/paciente",        roles: [ROLES.RECEPCIONISTA] },
  { label: "Psicólogos",   Icon: PsicologoIcon,  path: "/psicologos",      roles: AMBOS },
  { label: "Recepcionistas", Icon: RecepcionistaIcon, path: "/recepcionistas", roles: [ROLES.PSICOLOGO] },
  { label: "Disponibilidades", Icon: DisponibilidadesIcon, path: "/disponibilidades", roles: [ROLES.PSICOLOGO] },
  { label: "Disponibilidades dos Psicólogos", Icon: DisponibilidadesPsicologosIcon, path: "/disponibilidades", roles: [ROLES.RECEPCIONISTA] },
  { label: "Planos de Saúde",  Icon: PlanoSaudeIcon,      path: "/planos-saude",     roles: [ROLES.PSICOLOGO] },
  { label: "Financeiro",   Icon: FinanceiroIcon, path: "/financeiro",      roles: AMBOS },
];

export default function AppLayout({ children, breadcrumb }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { role } = usePermissions();
  const [menuAberto, setMenuAberto] = useState(false);

  const itensVisiveis = navItems.filter(item => item.roles.includes(role));

  const handleLogout = () => {
    setMenuAberto(false);
    signOut();
    navigate("/", { replace: true });
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', sans-serif",
      background: "#e8e8e8",
    }}>
      {/* Topbar */}
      <div style={{
        height: "52px",
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        zIndex: 20,
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="/Logo-Health-Mind.png"
            alt="Health Mind"
            style={{ height: "40px", width: "auto" }}
          />
        </div>

        {/* Avatar + dropdown */}
        <div style={{ position: "relative" }}>
          {/* Overlay para fechar ao clicar fora */}
          {menuAberto && (
            <div
              style={{ position: "fixed", inset: 0, zIndex: 90 }}
              onClick={() => setMenuAberto(false)}
            />
          )}

          {/* Avatar */}
          <div
            onClick={() => setMenuAberto(v => !v)}
            style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: "#1A4FA3", display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer",
              outline: menuAberto ? "2px solid #93b4e8" : "none",
              outlineOffset: "2px",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2" fill="none"/>
              <path d="M4 20 C4 16 8 13 12 13 C16 13 20 16 20 20" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
          </div>

          {/* Dropdown */}
          {menuAberto && (
            <div style={{
              position: "absolute", top: "calc(100% + 10px)", right: 0,
              background: "white", borderRadius: "12px", zIndex: 100,
              boxShadow: "0 8px 32px rgba(0,0,0,0.14)", minWidth: "200px",
              overflow: "hidden",
            }}>
              {/* User info */}
              <div style={{ padding: "14px 16px", borderBottom: "1px solid #eef0f6" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#111" }}>{user?.nome || "Usuário"}</div>
                <div style={{ fontSize: "12px", color: "#aaa", marginTop: "2px" }}>{user?.email || "—"}</div>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: "10px",
                  padding: "12px 16px", background: "none", border: "none",
                  fontSize: "13px", fontWeight: "600", color: "#e05050",
                  cursor: "pointer", textAlign: "left",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="#e05050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="16 17 21 12 16 7" stroke="#e05050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="21" y1="12" x2="9" y2="12" stroke="#e05050" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{
          width: "160px",
          background: "#1A4FA3",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          paddingTop: "8px",
        }}>
          {itensVisiveis.map(({ label, Icon, path }) => {
            const active = location.pathname === path;
            return (
              <button
                key={label}
                onClick={() => navigate(path)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 16px",
                  background: active ? "white" : "transparent",
                  border: "none",
                  borderRadius: active ? "8px 0 0 8px" : "0",
                  margin: active ? "0 0 0 8px" : "0",
                  color: active ? "#1A4FA3" : "white",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: active ? "700" : "500",
                  textAlign: "left",
                  transition: "background 0.15s",
                  width: active ? "calc(100% - 8px)" : "100%",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <Icon />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
          {/* Breadcrumb */}
          {breadcrumb && (
            <div style={{
              padding: "10px 20px",
              fontSize: "14px",
              color: "#333",
              fontWeight: "500",
              background: "#f0f0f0",
              borderBottom: "1px solid #ddd",
            }}>
              {breadcrumb}
            </div>
          )}
          {/* Page content */}
          <div style={{ flex: 1, padding: "24px", display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}