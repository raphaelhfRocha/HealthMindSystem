
export interface PacienteDTO {
    id?: string,
    nome: string,
    email: string,
    cpfCnpj: string,
    telefone: string,
    dataNascimento: Date,
    planoSaudePacienteDto?: PlanoSaudePacienteDTO,
    psicologoId: string
}