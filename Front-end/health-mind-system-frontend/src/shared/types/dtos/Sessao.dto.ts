import { StatusTipoAtendimentoEnum } from "shared/enums/statusTipoAtendimento.enum";
import { StatusSessaoEnum } from "shared/enums/statusSessao.enum";
import { PagamentoDTO } from "./Pagamento.dto";
import { RegistroSessaoDTO } from "./RegistroSessao.dto";
import { EscalaSessaoDTO } from "./EscalaSessao.dto";

export interface SessaoDTO {
    id?: string,
    pacienteId: string,
    psicologoId: string,
    dataSessao: Date,
    horaInicio: string,
    statusTipoAtendimento: StatusTipoAtendimentoEnum,
    pagamentoDTO?: PagamentoDTO,
    statusSessao: StatusSessaoEnum,
    registrosSessoesDTO?: RegistroSessaoDTO[],
    escalasSessoesDTO?: EscalaSessaoDTO[]
}
