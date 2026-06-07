import { StatusDiagnosticoEnum } from "shared/enums/statusDiagnostico.enum";

export interface DiagnosticoDTO {
    id?: string,
    prontuarioId: string,
    descricao: string,
    cid: string,
    dataDiagnostico: Date,
    statusDiagnostico: StatusDiagnosticoEnum,
    observacoes: string
}