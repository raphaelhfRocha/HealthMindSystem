import { BaseIdentity } from "./BaseIdentity";

export interface BasePessoa extends BaseIdentity {
    nome: string,
    email: string,
    cpfCnpj: string
}