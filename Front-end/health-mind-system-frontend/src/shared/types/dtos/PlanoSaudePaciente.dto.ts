import { PlanoSaudeDTO } from "./PlanoSaude.dto";

export interface PlanoSaudePacienteDTO {
    pacienteId?: string,
    planoSaudeId: string,
    numeroCarteirinha: string,
    dataValidade: string | Date,
    planoSaudeDTO?: PlanoSaudeDTO
};