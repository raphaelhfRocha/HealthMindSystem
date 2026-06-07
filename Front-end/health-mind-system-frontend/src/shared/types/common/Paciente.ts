import { BasePessoa } from "./BasePessoa";

export interface Paciente extends BasePessoa {
    
    dataNascimento: Date,
    psicologoId: string
}