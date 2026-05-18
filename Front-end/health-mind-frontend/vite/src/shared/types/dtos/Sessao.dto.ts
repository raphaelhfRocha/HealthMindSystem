import { StatusTipoAtendimentoEnum } from "shared/enums/statusTipoAtendimento.enum";
import { StatusSessaoEnum } from "shared/enums/statusSessao.enum";

export interface SessaoDTO {
    id?: string,
    pacienteId: string,
    psicologoId: string,
    dataSessao: Date,
    observacoes: string,
    statusTipoAtendimento: StatusTipoAtendimentoEnum,
    statusSessao: StatusSessaoEnum
}