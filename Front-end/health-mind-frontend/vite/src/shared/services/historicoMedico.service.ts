import { HistoricoMedicoDTO } from "shared/types/dtos/HistoricoMedico.dto";
import { api } from "./api";

export async function getAllHistoricosMedicos(): Promise<HistoricoMedicoDTO[]> {
    const response = await api.get<HistoricoMedicoDTO[]>("historico-medico");
    return response.data;
}

export async function getHistoricosMedicosByProntuarioId(prontuarioId: string): Promise<HistoricoMedicoDTO[]> {
    const response = await api.get<HistoricoMedicoDTO[]>(`/historico-medico/${prontuarioId}`);
    return response.data;
}

export async function registrarHistoricoMedico(historicoMedicoDto: HistoricoMedicoDTO): Promise<HistoricoMedicoDTO> {
    const response = await api.post("historico-medico", historicoMedicoDto);
    return response.data;
}

export async function editarHistoricoMedico(historicoId: string, historicoMedicoDto: HistoricoMedicoDTO): Promise<HistoricoMedicoDTO> {
    const response = await api.put(`historico-medico/${historicoId}`, historicoMedicoDto);
    return response.data;
}

export async function excluirHistoricoMedico(historicoId: string): Promise<void> {
    const response = await api.delete(`historico-medico/${historicoId}`);
    return response.data;
}