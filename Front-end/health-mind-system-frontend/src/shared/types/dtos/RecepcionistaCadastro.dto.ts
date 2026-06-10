import { StatusCargoEnum } from "../../domain/enums/status-cargo.enum";
import { StatusRoleEnum } from "../../domain/enums/status-role.enum";

export interface RecepcionistaCadastroDTO {
    nome: string;
    cpfCnpj: string;
    statusCargo: StatusCargoEnum;
    statusRole: StatusRoleEnum;
}