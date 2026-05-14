import { StatusCargoEnum } from "shared/enums/statusCargo.enum"
import { StatusRoleEnum } from "shared/enums/statusRole.enum"

export interface RecepcionistaDTO {
    id?: string,
    nome: string,
    email: string,
    cpfCnpj: string
    senha: string,
    statusCargo: StatusCargoEnum,
    statusRole: StatusRoleEnum
}