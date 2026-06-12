import { StatusCargoEnum } from "../../domain/enums/status-cargo.enum";
import { StatusRoleEnum } from "../../domain/enums/status-role.enum";
import { DisponibilidadeDTO } from "./Disponibilidade.dto";

export interface PsicologoDTO {
    id?: string;
    nome: string;
    email: string;
    senha?: string;
    cpfCnpj: string;
    statusCargo: StatusCargoEnum;
    statusRole: StatusRoleEnum;
    usuarioId?: string;
    crp: string;
    especialidade: string;
    valorConsulta: number;
    disponibilidadesDTO?: DisponibilidadeDTO[];
}