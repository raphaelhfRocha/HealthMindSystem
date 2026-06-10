import { StatusCargoEnum } from "../../domain/enums/status-cargo.enum";
import { StatusRoleEnum } from "../../domain/enums/status-role.enum";

export interface PsicologoEdicaoDTO {
    id?: string;
    nome: string;
    email?: string;
    cpfCnpj: string;
    statusCargo: StatusCargoEnum;
    statusRole: StatusRoleEnum;
    crp: string;
    especialidade: string;
    valorConsulta: number;
    regenerarCredenciais?: boolean;
}