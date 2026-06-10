import { StatusCargoEnum } from "../../domain/enums/status-cargo.enum";
import { StatusRoleEnum } from "../../domain/enums/status-role.enum";

export interface PsicologoCadastroDTO {
    nome: string;
    cpfCnpj: string;
    statusCargo: StatusCargoEnum;
    statusRole: StatusRoleEnum;
    crp: string;
    especialidade: string;
    valorConsulta: number;
}