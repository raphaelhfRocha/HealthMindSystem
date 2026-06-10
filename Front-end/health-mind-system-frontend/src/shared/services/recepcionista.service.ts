import { api } from "./api";
import { RecepcionistaDTO } from "../types/dtos/Recepcionista.dto";


const controller = "recepcionista";

export async function getAllRecepcionistas(): Promise<RecepcionistaDTO[]> {
    const response = await api.get<RecepcionistaDTO[]>(controller);
    return response.data;
}
