import { StatusDisponibilidadeEnum } from "shared/enums/statusDisponibilidade.enum";

export interface DisponibilidadeDTO {
    id?: string,
    psicologoId: string,
    dataDisponibilidade: Date,
    horaInicio: string,
    statusDisponibilidade: StatusDisponibilidadeEnum
}