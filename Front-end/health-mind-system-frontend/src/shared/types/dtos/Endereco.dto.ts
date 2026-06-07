export interface EnderecoDTO {
    cep: string,
    logradouro: string,
    complemento?: string,
    bairro: string,
    uf: string,
    localidade: string,
    regiao: string
}