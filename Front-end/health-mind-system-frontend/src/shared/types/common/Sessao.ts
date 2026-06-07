import { StatusTipoAtendimentoEnum } from "shared/enums/statusTipoAtendimento.enum";
import { BaseIdentity } from "./BaseIdentity";
import { StatusSessaoEnum } from "shared/enums/statusSessao.enum";

export interface Sessao extends BaseIdentity {
    pacienteId: string,
    psicologoId: string,
    dataSessao: Date,
    observacoes: string,
    statusTipoAtendimento: StatusTipoAtendimentoEnum,
    statusSessao: StatusSessaoEnum
}