import { StatusProntuarioEnum } from "shared/enums/statusProntuario.enum";
import { MedicamentoDTO } from "./Medicamento.dto";
import { ContatoEmergenciaDTO } from "./ContatoEmergencia.dto";

export interface ProntuarioDTO {
    id?: string,
    pacienteId: string,
    anotacoes: string,
    dataAbertura: string,
    statusProntuario: StatusProntuarioEnum,
    contatoEmergenciaDTO?: ContatoEmergenciaDTO,
    medicamentosDTO?: MedicamentoDTO[]
}