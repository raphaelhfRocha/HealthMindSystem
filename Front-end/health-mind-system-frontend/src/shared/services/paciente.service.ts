import { PacienteDTO } from "shared/types/dtos/Paciente.dto";
import { api } from "./api";

const controller = "paciente";

export async function getAllPacientes(): Promise<PacienteDTO[]> {
    const response = await api.get<PacienteDTO[]>("paciente");
    return response.data;
}

export async function getPacienteById(pacienteId: string): Promise<PacienteDTO> {
    const response = await api.get<PacienteDTO>(`${controller}/${pacienteId}`);
    return response.data;
}

export async function getPacientesByNome(nome: string): Promise<PacienteDTO[]> {
    const response = await api.get<PacienteDTO[]>(`${controller}/nome/${nome}`);
    return response.data;
}

export async function getPacientesByPsicologoId(psicologoId?: string): Promise<PacienteDTO[]> {
    const response = await api.get<PacienteDTO[]>(`${controller}/psicologos/${psicologoId}`);
    return response.data;
}

export async function registrarPaciente(pacienteDto: PacienteDTO): Promise<PacienteDTO> {
    const response = await api.post(controller, pacienteDto);
    return response.data;
}

export async function editarPaciente(pacienteId: string, pacienteDto: PacienteDTO): Promise<PacienteDTO> {
    const response = await api.put(`${controller}/${pacienteId}`, pacienteDto);
    return response.data;
}