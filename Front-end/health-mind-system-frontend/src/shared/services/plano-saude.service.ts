import { PlanoSaudeDTO } from "../types/dtos/PlanoSaude.dto";


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