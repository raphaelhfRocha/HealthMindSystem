import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { ROLES } from "../shared/constants/roles";
import { usePermissions } from "../shared/hooks/usePermissions";
import { useAuth } from "../shared/context/AuthContext";

const CalendarIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <rect x="6" y="10" width="40" height="34" rx="5" stroke="white" strokeWidth="3" fill="none"/>
    <rect x="14" y="6" width="4" height="10" rx="2" fill="white"/>
    <rect x="34" y="6" width="4" height="10" rx="2" fill="white"/>
    <line x1="6" y1="22" x2="46" y2="22" stroke="white" strokeWidth="2.5"/>
    <rect x="13" y="28" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.8"/>
    <rect x="23" y="28" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.8"/>
    <rect x="33" y="28" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.8"/>
    <circle cx="38" cy="38" r="5" stroke="white" strokeWidth="2" fill="none"/>
    <line x1="38" y1="35" x2="38" y2="38" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="38" y1="38" x2="41" y2="40" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const PsychologistIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="16" r="10" stroke="white" strokeWidth="3" fill="none"/>
    <path d="M8 44 C8 34 18 28 26 28 C34 28 44 34 44 44" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
  </svg>
);

const ProntuarioIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <rect x="10" y="6" width="28" height="38" rx="4" stroke="white" strokeWidth="3" fill="none"/>
    <rect x="20" y="2" width="8" height="8" rx="2" stroke="white" strokeWidth="2.5" fill="none"/>
    <line x1="17" y1="22" x2="35" y2="22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="17" y1="30" x2="35" y2="30" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="17" y1="38" x2="27" y2="38" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M33 36 C33 33 35 31 37 31 C39 31 41 33 41 36 C41 39 37 42 37 42 C37 42 33 39 33 36Z" stroke="white" strokeWidth="2" fill="none"/>
    <circle cx="37" cy="35" r="2" fill="white"/>
  </svg>
);

const HistoricoIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <rect x="8" y="6" width="26" height="38" rx="4" stroke="white" strokeWidth="3" fill="none"/>
    <rect x="18" y="6" width="20" height="32" rx="3" stroke="white" strokeWidth="2.5" fill="white" fillOpacity="0.1"/>
    <line x1="22" y1="16" x2="34" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <line x1="22" y1="23" x2="34" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <line x1="22" y1="30" x2="29" y2="30" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const PacientesIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="14" r="8" stroke="white" strokeWidth="3" fill="none"/>
    <circle cx="11" cy="18" r="6" stroke="white" strokeWidth="2.5" fill="none"/>
    <circle cx="41" cy="18" r="6" stroke="white" strokeWidth="2.5" fill="none"/>
    <path d="M4 42 C4 35 7 30 11 30" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M48 42 C48 35 45 30 41 30" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M10 46 C10 37 18 32 26 32 C34 32 42 37 42 46" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
  </svg>
);

const FinanceiroIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="22" r="14" stroke="white" strokeWidth="3" fill="none"/>
    <line x1="26" y1="12" x2="26" y2="14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="26" y1="30" x2="26" y2="32" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M21 28 C21 28 23 30 26 30 C29 30 31 28 31 26 C31 24 29 23 26 22 C23 21 21 20 21 18 C21 16 23 14 26 14 C29 14 31 16 31 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M10 40 C14 36 20 34 26 34" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M10 40 L42 40 L42 44 Q26 48 10 44 Z" stroke="white" strokeWidth="2" fill="white" fillOpacity="0.2"/>
    <line x1="38" y1="34" x2="38" y2="46" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="34" y1="38" x2="42" y2="38" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

// const SuporteIcon = () => (
//   <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
//     <circle cx="26" cy="19" r="9" stroke="white" strokeWidth="3" fill="none"/>
//     <path d="M10 46 C10 37 18 31 26 31 C34 31 42 37 42 46" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
//     <path d="M13 20 C13 12 18 7 26 7 C34 7 39 12 39 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
//     <rect x="11" y="19" width="4.5" height="8" rx="2.2" fill="white"/>
//     <rect x="36.5" y="19" width="4.5" height="8" rx="2.2" fill="white"/>
//     <path d="M39 24 L39 28 C39 31 34 32 30 32" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
//   </svg>
// );

const RecepcionistaIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="19" r="9" stroke="white" strokeWidth="3" fill="none" />
    <path d="M10 46 C10 37 18 31 26 31 C34 31 42 37 42 46" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
);

const DisponibilidadeIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="26" r="18" stroke="white" strokeWidth="3" fill="none"/>
    <line x1="26" y1="9" x2="26" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="26" y1="40" x2="26" y2="43" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="9" y1="26" x2="12" y2="26" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="40" y1="26" x2="43" y2="26" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <polyline points="26,15 26,26 34,31" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const PlanoSaudeIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <path d="M26 44 C26 44 8 32 8 19 C8 13 12 9 18 9 C22 9 24 11 26 14 C28 11 30 9 34 9 C40 9 44 13 44 19 C44 32 26 44 26 44Z" stroke="white" strokeWidth="3" strokeLinejoin="round" fill="none"/>
    <line x1="26" y1="18" x2="26" y2="30" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    <line x1="20" y1="24" x2="32" y2="24" stroke="white" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const AMBOS = [ROLES.PSICOLOGO, ROLES.RECEPCIONISTA];

const menuItems = [
  { label: "Agendamentos", Icon: CalendarIcon,    path: "/agendamentos", roles: AMBOS },
  { label: "Psicólogos",   Icon: PsychologistIcon, path: "/psicologos",  roles: AMBOS },
  { label: "Prontuários",  Icon: ProntuarioIcon,  path: "/prontuario",   roles: [ROLES.PSICOLOGO] },
  { label: "Histórico",    Icon: HistoricoIcon,   path: "/historico",    roles: [ROLES.PSICOLOGO] },
  { label: "Pacientes",    Icon: PacientesIcon,   path: "/paciente",     roles: [ROLES.RECEPCIONISTA] },
  { label: "Financeiro",   Icon: FinanceiroIcon,  path: "/financeiro",   roles: AMBOS },
  { label: "Recepcionistas", Icon: RecepcionistaIcon,  path: "/recepcionistas",   roles: [ROLES.PSICOLOGO] },
  { label: "Disponibilidades", Icon: DisponibilidadeIcon, path: "/disponibilidades", roles: [ROLES.PSICOLOGO] },
  { label: "Disponibilidades Psicólogos", Icon: DisponibilidadeIcon, path: "/disponibilidades", roles: [ROLES.RECEPCIONISTA] },
  { label: "Plano de Saúde", Icon: PlanoSaudeIcon, path: "/planos-saude",   roles: [ROLES.PSICOLOGO] },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { role } = usePermissions();
  const { user } = useAuth();

  const itensVisiveis = menuItems.filter(item => item.roles.includes(role));

  return (
    <AppLayout>
      <div style={{
        background: "white",
        borderRadius: "20px",
        padding: "2rem 2.5rem",
        width: "100%",
        maxWidth: "560px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}>
        <h1 style={{
          textAlign: "center", fontSize: "22px", fontWeight: "700",
          color: "#1a1a1a", marginBottom: "1.8rem",
        }}>
          Bem-vindo(a){user?.nome ? ` ${user.nome}` : ""}
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {itensVisiveis.map(({ label, Icon, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              style={{
                background: "#1A4FA3", border: "none", borderRadius: "14px",
                padding: "20px 10px 16px", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
                transition: "transform 0.15s, filter 0.15s", outline: "none",
              }}
              onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.15)"}
              onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
              onMouseDown={e => e.currentTarget.style.transform = "scale(0.96)"}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <Icon />
              <span style={{ color: "white", fontSize: "14px", fontWeight: "600", textAlign: "center", lineHeight: 1.2 }}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}