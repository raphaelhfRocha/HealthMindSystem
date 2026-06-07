import { HistoricoMedicoDTO } from "shared/types/dtos/HistoricoMedico.dto";
import { api } from "./api";

const controller = "historicoMedico";

export async function getAllHistoricosMedicos(): Promise<HistoricoMedicoDTO[]> {
    const response = await api.get<HistoricoMedicoDTO[]>(controller);
    return response.data;
}

export async function getHistoricosMedicosByProntuarioId(prontuarioId: string): Promise<HistoricoMedicoDTO[]> {
    const response = await api.get<HistoricoMedicoDTO[]>(`${controller}/prontuario/${prontuarioId}`);
    return response.data;
}

export async function registrarHistoricoMedico(historicoMedicoDto: HistoricoMedicoDTO): Promise<HistoricoMedicoDTO> {
    console.log('Historico:', historicoMedicoDto);
    const response = await api.post(controller, historicoMedicoDto);
    return response.data;
}

export async function editarHistoricoMedico(historicoId: string, historicoMedicoDto: HistoricoMedicoDTO): Promise<HistoricoMedicoDTO> {
    // console.log('(PUT) - historicoMedicoDto:', historicoMedicoDto);
    console.log('(PUT) - metaTerapêuticaDto:', historicoMedicoDto.metasTerapeuticasDTO);
    const response = await api.put(`${controller}/${historicoId}`, historicoMedicoDto);
    return response.data;
}

export async function excluirHistoricoMedico(historicoId: string): Promise<void> {
    const response = await api.delete(`${controller}/${historicoId}`);
    return response.data;
}

export async function excluirSaudeMental(historicoId: string): Promise<void> {
    const response = await api.delete(`${controller}/saude-mental/${historicoId}`);
    return response.data;
}