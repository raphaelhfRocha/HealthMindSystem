import { EnderecoDTO } from "./Endereco.dto";

export interface ContatoEmergenciaDTO {
    prontuarioId: string,
    nome: string,
    telefone: string,
    relacaoParentesco: string,
    enderecoDTO?: EnderecoDTO
}