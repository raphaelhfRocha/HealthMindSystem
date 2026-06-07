import { z } from 'zod';

export const loginValidation = z.object({
    email: z
        .string()
        .min(1, 'E-mail obrigatório')
        .email('E-mail inválido'),

    senha: z
        .string()
        .min(6, 'Senha deve possuir no mínimo 6 caracteres')
});

export type LoginFormData =
    z.infer<typeof loginValidation>;