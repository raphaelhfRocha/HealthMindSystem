import { StatusTipoAtendimentoEnum } from "shared/enums/status-tipo-atendimento.enum";
import { StatusDisponibilidadeEnum } from "shared/enums/status-disponibilidade.enum";

export interface DisponibilidadeDTO {
    id?: string,
    psicologoId: string,
    dataDisponibilidade: Date,
    horaInicio: string,
    statusTipoAtendimento: StatusTipoAtendimentoEnum,
    statusDisponibilidade: StatusDisponibilidadeEnum
}