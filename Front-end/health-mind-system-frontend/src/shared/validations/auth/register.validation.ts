import { z } from 'zod';

export const registerValidation = z.object({
    nome: z
        .string()
        .min(3, 'Nome obrigatório'),

    email: z
        .string()
        .email('E-mail inválido'),

    senha: z
        .string()
        .min(6, 'Senha inválida'),

    confirmarSenha: z
        .string()
}).refine(data => data.senha === data.confirmarSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha']
});

export type RegisterFormData =
    z.infer<typeof registerValidation>;