import { api } from "./api";
import { PsicologoDTO } from "../types/dtos/Psicologo.dto";
import { LoginDTO } from "../types/dtos/Login.dto";
import { LoginResponseDTO } from "../types/dtos/LoginResponse.dto";
import { PsicologoCadastroDTO } from "../types/dtos/PsicologoCadastro.dto";
import { PsicologoEdicaoDTO } from "../types/dtos/PsicologoEdicao.dto";
import { RecepcionistaCadastroDTO } from "../types/dtos/RecepcionistaCadastro.dto";
import { RecepcionistaDTO } from "../types/dtos/Recepcionista.dto";
import { RecepcionistaEdicaoDTO } from "../types/dtos/RecepcionistaEdicao.dto";


const controller = "auth";
const controllerAuthPsicologo = "auth/psicologos"
const controllerAuthRecepcionista = "auth/recepcionistas"

export async function login(loginDto: LoginDTO): Promise<LoginResponseDTO> {
    const response = await api.post(`${controller}/login`, loginDto);
    return response.data;
}

export async function cadastrarPsicologo(psicologoCadastroDto: PsicologoCadastroDTO): Promise<PsicologoDTO> {
    const response = await api.post(`${controllerAuthPsicologo}`, psicologoCadastroDto);
    return response.data;
}

export async function editarPsicologo(psicologoId: string, psicologoEdicaoDto: PsicologoEdicaoDTO): Promise<PsicologoDTO> {
    const response = await api.put(`${controllerAuthPsicologo}/${psicologoId}`, psicologoEdicaoDto);
    return response.data;
}

export async function cadastrarRecepcionista(recepcionistaCadastroDto: RecepcionistaCadastroDTO): Promise<RecepcionistaDTO> {
    const response = await api.post(`${controllerAuthRecepcionista}`, recepcionistaCadastroDto);
    return response.data;
}

export async function editarRecepcionista(recepcionistaId: string, recepcionistaEdicaoDto: RecepcionistaEdicaoDTO): Promise<RecepcionistaDTO> {
    const response = await api.put(`${controllerAuthRecepcionista}/${recepcionistaId}`, recepcionistaEdicaoDto);
    return response.data;
}

export async function excluirRecepcionista(recepcionistaId: string): Promise<void> {
    const response = await api.delete(`${controllerAuthRecepcionista}/${recepcionistaId}`);
    return response.data;
}