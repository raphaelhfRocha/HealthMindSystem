import { BaseIdentity } from "./BaseIdentity";

export interface Progressao extends BaseIdentity {
    pacienteId: string,
    prontuarioId: string,
    descricao: string,
    dataRegistro: Date
}