import { DisponibilidadeDTO } from "./Disponibilidade.dto";

export interface PsicologoDTO {
    id?: string,
    usuarioId: string,
    crp: string,
    especialidade: string,
    disponibilidades: DisponibilidadeDTO[]
}