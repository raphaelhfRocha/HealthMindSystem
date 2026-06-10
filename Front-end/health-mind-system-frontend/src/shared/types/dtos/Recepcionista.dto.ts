import { StatusCargoEnum } from "../../domain/enums/status-cargo.enum";
import { StatusRoleEnum } from "../../domain/enums/status-role.enum";

export interface RecepcionistaDTO {
    id?: string;
    nome: string;
    email: string;
    senha?: string;
    cpfCnpj: string;
    statusCargo: StatusCargoEnum;
    statusRole: StatusRoleEnum;
}
