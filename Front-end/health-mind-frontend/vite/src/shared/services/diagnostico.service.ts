import { api } from "./api";
import { DiagnosticoDTO } from "shared/types/dtos/Diagnostico.dto";

export async function getAllDiagnosticos(): Promise<DiagnosticoDTO[]> {
    const response = await api.get<DiagnosticoDTO[]>("diagnostico");
    return response.data;
}

export async function getDiagnosticoByProntuarioId(prontuarioId: string): Promise<DiagnosticoDTO[]> {
    const response = await api.get<DiagnosticoDTO[]>(`diagnostico/${prontuarioId}`);
    return response.data
}

export async function registrarDiagnostico(diagnosticoDto: DiagnosticoDTO): Promise<DiagnosticoDTO> {
    const response = await api.post("diagnostico", diagnosticoDto);
    return response.data;
}

export async function editarDiagnostico(diagnosticoId: string, diagnosticoDto: DiagnosticoDTO): Promise<DiagnosticoDTO> {
    const response = await api.put(`diagnostico/${diagnosticoId}`, diagnosticoDto);
    return response.data;
}
