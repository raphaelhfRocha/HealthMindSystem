import { z } from 'zod';

export const psicologoValidation = z.object({
    id: z
        .string()
        .optional(),

    nome: z
        .string()
        .min(3, 'Nome obrigatório'),

    email: z
        .string()
        .email('E-mail inválido'),

    cpfCnpj: z
        .string()
        .min(11, 'CPF inválido'),

    crp: z
        .string()
        .min(6, 'CRP inválido'),

    especialidade: z
        .string()
        .min(3, 'Especialidade obrigatória'),

    statusCargo: z.number(),

    statusRole: z.number()
});

export type PsicologoFormData =
    z.infer<typeof psicologoValidation>;