export interface HistoricoMedicoDTO {
    id?: string,
    pacienteId: string,
    prontuarioId: string,
    razaoAtendimento: string,
    impactoRazao: string,
    dataRegistro: Date,
    saudeMentalDto?: SaudeMentalDTO,
    metasTerapeuticas?: MetaTerapeuticaDTO[]
}