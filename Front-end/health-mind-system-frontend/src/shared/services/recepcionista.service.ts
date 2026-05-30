import { api } from "./api";
import { RecepcionistaDTO } from "shared/types/dtos/Recepcionista.dto";

const controller = "recepcionista";


export async function getAllRecepcionistas(): Promise<RecepcionistaDTO[]> {
    const response = await api.get<RecepcionistaDTO[]>(controller);
    return response.data;
}

export async function cadastrarRecepcionista(recepcionistaDto: RecepcionistaDTO): Promise<RecepcionistaDTO> {
    const response = await api.post(controller, recepcionistaDto);
    return response.data;
}

export async function atualizarRecepcionista(recepcionistaId: string, recepcionistaDto: RecepcionistaDTO): Promise<RecepcionistaDTO> {
    const response = await api.put(`${controller}/${recepcionistaId}`, recepcionistaDto);
    return response.data;
}

export async function excluirRecepcionista(recepcionistaId: string): Promise<void> {
    const response = await api.delete(`${controller}/${recepcionistaId}`);
    return response.data;
}
