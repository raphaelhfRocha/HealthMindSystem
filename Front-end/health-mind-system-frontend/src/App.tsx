import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./shared/context/AuthContext";
import ProtectedRoute from "./shared/components/ProtectedRoute";
import RoleRoute from "./shared/components/RoleRoute";
import { ROLES } from "./shared/constants/roles";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AgendamentosPage from "./pages/agendamentos/AgendamentosPage";
import RealizarAgendamentoPage from "./pages/agendamentos/RealizarAgendamentoPage";
import ConsultarAgendamentoPage from "./pages/agendamentos/ConsultarAgendamentoPage";
import AgendaDoDiaPage from "./pages/agendamentos/AgendaDoDiaPage";
import ProntuariosPage from "./pages/prontuario/ProntuariosPage";
import CadastrarProntuarioPage from "./pages/prontuario/CadastrarProntuarioPage";
import VisualizarProntuarioPage from "./pages/prontuario/VisualizarProntuarioPage";
import EditarProntuarioPage from "./pages/prontuario/EditarProntuarioPage";
import EditarContatoEmergenciaPage from "./pages/prontuario/EditarContatoEmergenciaPage";
import EditarAnotacoesPage from "./pages/prontuario/EditarAnotacoesPage";
import HistoricoPage from "./pages/historico/HistoricoPage";
import VisualizarHistoricoPage from "./pages/historico/VisualizarHistoricoPage";
import PacientesPage from "./pages/pacientes/PacientesPage";
import { EditarPacientePage } from "./pages/pacientes/EditarPacientePage";
import PsicologosPage from "./pages/psicologos/PsicologosPage";
import VisualizarPsicologoPage from "./pages/psicologos/VisualizarPsicologoPage";
import RecepcionistasPage from "./pages/recepcionistas/RecepcionistasPage";
import VisualizarRecepcionistaPage from "./pages/recepcionistas/VisualizarRecepcionistaPage";
import FinanceiroPage from "./pages/financeiro/FinanceiroPage";
import PlanosSaudePage from "./pages/planos-saude/PlanosSaudePage";
import VisualizarPlanoSaudePage from "./pages/planos-saude/VisualizarPlanoSaudePage";
import DisponibilidadesPage from "./pages/disponibilidades/DisponibilidadesPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            {/* Disponível para ambos os cargos */}
            <Route path="/home" element={<HomePage />} />
            <Route path="/agendamentos" element={<AgendamentosPage />} />
            <Route path="/agendamentos/consultar" element={<ConsultarAgendamentoPage />} />
            <Route path="/agendamentos/dia/:date" element={<AgendaDoDiaPage />} />
            <Route path="/psicologos" element={<PsicologosPage />} />
            <Route path="/disponibilidades" element={<DisponibilidadesPage />} />
            <Route path="/financeiro" element={<FinanceiroPage />} />

            {/* Exclusivo do Recepcionista */}
            <Route element={<RoleRoute allow={[ROLES.RECEPCIONISTA]} />}>
              <Route path="/agendamentos/realizar" element={<RealizarAgendamentoPage />} />
              <Route path="/paciente" element={<PacientesPage />} />
              <Route path="/paciente/:id/editar" element={<EditarPacientePage />} />
            </Route>

            {/* Exclusivo do Psicólogo */}
            <Route element={<RoleRoute allow={[ROLES.PSICOLOGO]} />}>
              <Route path="/prontuario" element={<ProntuariosPage />} />
              <Route path="/prontuario/novo" element={<CadastrarProntuarioPage />} />
              <Route path="/prontuario/:id" element={<VisualizarProntuarioPage />} />
              <Route path="/prontuario/:id/editar" element={<EditarProntuarioPage />} />
              <Route path="/prontuario/:id/editar-contato" element={<EditarContatoEmergenciaPage />} />
              <Route path="/prontuario/:id/editar-anotacoes" element={<EditarAnotacoesPage />} />
              <Route path="/historico" element={<HistoricoPage />} />
              <Route path="/historico/:id" element={<VisualizarHistoricoPage />} />
              <Route path="/psicologos/:id" element={<VisualizarPsicologoPage />} />
              <Route path="/recepcionistas" element={<RecepcionistasPage />} />
              <Route path="/recepcionistas/:id" element={<VisualizarRecepcionistaPage />} />
              <Route path="/planos-saude" element={<PlanosSaudePage />} />
              <Route path="/planos-saude/:id" element={<VisualizarPlanoSaudePage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
