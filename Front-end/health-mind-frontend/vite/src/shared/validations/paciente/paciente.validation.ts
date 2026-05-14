import { z } from 'zod';

export const pacienteValidation = z.object({
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
        .min(11, 'CPF inválido')
        .max(14, 'CNPJ inválido'),

    dataNascimento: z
        .string()
        .min(1, 'Data nascimento obrigatória'),

    psicologoId: z
        .string()
        .min(1, 'Psicólogo obrigatório')
});

export type PacienteFormData =
    z.infer<typeof pacienteValidation>;