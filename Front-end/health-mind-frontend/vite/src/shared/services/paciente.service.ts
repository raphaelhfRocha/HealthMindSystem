import { PacienteDTO } from "shared/types/dtos/Paciente.dto";
import { api } from "./api";


export async function getAllPacientes(): Promise<PacienteDTO[]> {
    const response = await api.get<PacienteDTO[]>("paciente");
    return response.data;
}

export async function getPacienteByPsicologoId(psicologoId: string): Promise<PacienteDTO[]> {
    const response = await api.get<PacienteDTO[]>(`paciente/psicologo/${psicologoId}`);
    return response.data;
}

export async function registrarPaciente(pacienteDto: PacienteDTO): Promise<PacienteDTO> {
    const response = await api.post("paciente", pacienteDto);
    return response.data;
}

export async function editarPaciente(pacienteId: string, pacienteDto: PacienteDTO): Promise<PacienteDTO> {
    const response = await api.put(`paciente/${pacienteId}`, pacienteDto);
    return response.data;
}