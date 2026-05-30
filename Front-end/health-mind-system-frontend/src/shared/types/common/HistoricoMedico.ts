import { BaseIdentity } from "./BaseIdentity";

export interface HistoricoMedico extends BaseIdentity {
    pacienteId: string,
    prontuarioId: string,
    descricao: string,
    dataRegistro: Date
}