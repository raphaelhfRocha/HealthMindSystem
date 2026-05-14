import { StatusDiagnosticoEnum } from "shared/enums/statusDiagnostico.enum";
import { BaseIdentity } from "./BaseIdentity";

export interface Diagnostico extends BaseIdentity {
    prontuarioId: string,
    descricao: string,
    cid: string,
    dataDiagnostico: Date,
    statusDiagnostico: StatusDiagnosticoEnum,
    observacoes: string
}