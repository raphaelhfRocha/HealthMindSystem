import { StatusCargoEnum } from "../../domain/enums/status-cargo.enum";
import { StatusRoleEnum } from "../../domain/enums/status-role.enum";
import { DisponibilidadeDTO } from "./Disponibilidade.dto";

export interface PsicologoDTO {
    id?: string;
    nome: string;
    email: string;
    cpfCnpj: string;
    statusCargo: StatusCargoEnum;
    statusRole: StatusRoleEnum;
    crp: string;
    especialidade: string;
    disponibilidadesDTO?: DisponibilidadeDTO[];
}