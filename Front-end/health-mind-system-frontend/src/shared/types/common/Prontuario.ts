import { StatusProntuarioEnum } from "shared/enums/statusProntuario.enum";
import { BaseIdentity } from "./BaseIdentity";
import { Medicamento } from "./Medicamento";

export interface Prontuario extends BaseIdentity {
    pacienteId: string,
    descricao: string,
    dataAbertura: Date,
    statusProntuario: StatusProntuarioEnum,
    medicamentos?: Medicamento[]
}