import { PlanoSaudePacienteDTO } from "./PlanoSaudePaciente.dto";

export interface PacienteDTO {
    id?: string,
    nome: string,
    email: string,
    cpfCnpj: string,
    telefone: string,
    dataNascimento: string | Date,
    planoSaudePacienteDTO?: PlanoSaudePacienteDTO,
    psicologoId: string
}