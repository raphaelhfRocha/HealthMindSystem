import { api } from "./api";
import { DiagnosticoDTO } from "shared/types/dtos/Diagnostico.dto";

const controller = "diagnostico";

export async function getAllDiagnosticos(): Promise<DiagnosticoDTO[]> {
    const response = await api.get<DiagnosticoDTO[]>(controller);
    return response.data;
}

export async function getDiagnosticoByProntuarioId(prontuarioId: string): Promise<DiagnosticoDTO[]> {
    const response = await api.get<DiagnosticoDTO[]>(`${controller}/prontuario/${prontuarioId}`);
    return response.data
}

export async function registrarDiagnostico(diagnosticoDto: DiagnosticoDTO): Promise<DiagnosticoDTO> {
    const response = await api.post(controller, diagnosticoDto);
    return response.data;
}

export async function editarDiagnostico(diagnosticoId: string, diagnosticoDto: DiagnosticoDTO): Promise<DiagnosticoDTO> {
    const response = await api.put(`${controller}/${diagnosticoId}`, diagnosticoDto);
    return response.data;
}
