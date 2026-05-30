import { StatusProntuarioEnum } from "shared/enums/statusProntuario.enum";
import { MedicamentoDTO } from "./Medicamento.dto";
import { ContatoEmergenciaDTO } from "./ContatoEmergencia.dto";

export interface ProntuarioDTO {
    id?: string,
    pacienteId: string,
    descricao: string,
    dataAbertura: Date,
    statusProntuario: StatusProntuarioEnum,
    contatoEmergenciaDto?: ContatoEmergenciaDTO,
    medicamentos?: MedicamentoDTO[]
}