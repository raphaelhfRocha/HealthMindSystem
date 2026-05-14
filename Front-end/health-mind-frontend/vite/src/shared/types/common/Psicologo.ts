import { BaseUsuario } from "./BaseUsuario";
import { Disponibilidade } from "./Disponibilidade";

export interface Psicologo extends BaseUsuario {
    usuarioId: string,
    crp: string,
    especialidade: string,
    disponibilidades: Disponibilidade[]
}