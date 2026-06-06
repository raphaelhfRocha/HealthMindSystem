import { SaudeMentalDTO } from "./SaudeMental.dto";
import { MetaTerapeuticaDTO } from "./MetaTerapeutica.dto";

export interface HistoricoMedicoDTO {
    id?: string,
    pacienteId: string,
    prontuarioId: string,
    razaoAtendimento: string,
    impactoRazao: string,
    expectativaAtendimento: string,
    dataRegistro: Date,
    saudeMentalDTO?: SaudeMentalDTO,
    metasTerapeuticasDTO?: MetaTerapeuticaDTO[]
}
