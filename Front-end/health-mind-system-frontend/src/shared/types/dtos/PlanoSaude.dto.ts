import { StatusPlanoSaudeEnum } from "../../domain/enums/status-plano-saude.enum";

export interface PlanoSaudeDTO {
    id?: string,
    nome: string,
    codigo: string,
    statusPlanoSaude: StatusPlanoSaudeEnum,
    telefone: string,
    email: string,
    coberturaPlanoDto: CoberturaPlanoDTO
}