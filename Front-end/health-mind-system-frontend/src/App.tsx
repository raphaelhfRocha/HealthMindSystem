import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import EditarPsicologoPage from "./pages/psicologos/EditarPsicologoPage";
import RecepcionistasPage from "./pages/recepcionistas/RecepcionistasPage";
import EditarRecepcionistaPage from "./pages/recepcionistas/EditarRecepcionistaPage";
import FinanceiroPage from "./pages/financeiro/FinanceiroPage";
import PlanosSaudePage from "./pages/planos-saude/PlanosSaudePage";
import VisualizarPlanoSaudePage from "./pages/planos-saude/VisualizarPlanoSaudePage";
import DisponibilidadesPage from "./pages/disponibilidades/DisponibilidadesPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/agendamentos" element={<AgendamentosPage />} />
        <Route path="/agendamentos/realizar" element={<RealizarAgendamentoPage />} />
        <Route path="/agendamentos/consultar" element={<ConsultarAgendamentoPage />} />
        <Route path="/agendamentos/dia/:date" element={<AgendaDoDiaPage />} />
        <Route path="/prontuario" element={<ProntuariosPage />} />
        <Route path="/prontuario/novo" element={<CadastrarProntuarioPage />} />
        <Route path="/prontuario/:id" element={<VisualizarProntuarioPage />} />
        <Route path="/prontuario/:id/editar" element={<EditarProntuarioPage />} />
        <Route path="/prontuario/:id/editar-contato" element={<EditarContatoEmergenciaPage />} />
        <Route path="/prontuario/:id/editar-anotacoes" element={<EditarAnotacoesPage />} />
        <Route path="/historico" element={<HistoricoPage />} />
        <Route path="/historico/:id" element={<VisualizarHistoricoPage />} />
        <Route path="/paciente" element={<PacientesPage />} />
        <Route path="/paciente/:id/editar" element={<EditarPacientePage />} />
        <Route path="/psicologos" element={<PsicologosPage />} />
        <Route path="/psicologos/:id/editar" element={<EditarPsicologoPage />} />
        <Route path="/recepcionistas" element={<RecepcionistasPage />} />
        <Route path="/recepcionistas/:id/editar" element={<EditarRecepcionistaPage />} />
        <Route path="/financeiro" element={<FinanceiroPage />} />
        <Route path="/disponibilidades" element={<DisponibilidadesPage />} />
        <Route path="/planos-saude" element={<PlanosSaudePage />} />
        <Route path="/planos-saude/:id" element={<VisualizarPlanoSaudePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
