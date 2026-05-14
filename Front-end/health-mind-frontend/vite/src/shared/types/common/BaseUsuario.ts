import { StatusCargoEnum } from "shared/enums/statusCargo.enum";
import { StatusRoleEnum } from "shared/enums/statusRole.enum";
import { BasePessoa } from "./BasePessoa";

export interface BaseUsuario extends BasePessoa {
    senha: string,
    statusCargo: StatusCargoEnum,
    statusRole: StatusRoleEnum
}