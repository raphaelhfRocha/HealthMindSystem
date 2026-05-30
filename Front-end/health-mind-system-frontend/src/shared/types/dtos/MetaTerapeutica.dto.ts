import { StatusMetaTerapeuticaEnum } from "../../domain/enums/status-meta-terapeutica.enum";

export interface MetaTerapeuticaDTO {
    id: string,
    historicoMedicoId: string,
    titulo: string,
    statusMetaTerapeutica: StatusMetaTerapeuticaEnum,
    observacoes?: string
}