import { StatusPlanoSaudeEnum } from "../../domain/enums/status-plano-saude.enum";
import { CoberturaPlanoDTO } from "./CoberturaPlano.dto";

export interface PlanoSaudeDTO {
    id?: string,
    nome: string,
    codigo: string,
    statusPlanoSaude: StatusPlanoSaudeEnum,
    telefone: string,
    email: string,
    coberturasPlanoDTO?: CoberturaPlanoDTO[]
}