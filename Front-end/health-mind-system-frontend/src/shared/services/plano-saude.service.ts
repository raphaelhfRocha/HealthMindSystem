import { api } from "./api";
import { PlanoSaudeDTO } from "../types/dtos/PlanoSaude.dto";
import { CoberturaPlanoDTO } from "../types/dtos/CoberturaPlano.dto";


const controller = "planoSaude";

export async function getAllPlanosSaude(): Promise<PlanoSaudeDTO[]> {
    const response = await api.get<PlanoSaudeDTO[]>(controller);
    return response.data;
}

export async function registrarPlanoSaude(planoSaudeDto: PlanoSaudeDTO): Promise<PlanoSaudeDTO> {
    const response = await api.post(controller, planoSaudeDto);
    return response.data;
}

export async function atualizarPlanoSaude(planoSaudeId: string, planoSaudeDto: PlanoSaudeDTO): Promise<PlanoSaudeDTO> {
    const response = await api.put(`${controller}/${planoSaudeId}`, planoSaudeDto);
    return response.data;
}

export async function registrarCoberturaPlano(planoSaudeId: string, coberturaPlanoDto: CoberturaPlanoDTO): Promise<CoberturaPlanoDTO> {
    const response = await api.post(`${controller}/${planoSaudeId}/coberturas-plano`, coberturaPlanoDto);
    return response.data;
}

export async function atualizarCoberturaPlano(planoSaudeId: string, especialidade: string, coberturaPlanoDto: CoberturaPlanoDTO): Promise<CoberturaPlanoDTO> {
    const response = await api.put(`${controller}/${planoSaudeId}/coberturas-plano/${especialidade}`, coberturaPlanoDto);
    return response.data;
}

export async function removerCoberturaPlano(planoSaudeId: string, especialidade: string): Promise<void> {
    const response = await api.delete(`${controller}/${planoSaudeId}/coberturas-plano/${especialidade}`)
    return response.data;
}