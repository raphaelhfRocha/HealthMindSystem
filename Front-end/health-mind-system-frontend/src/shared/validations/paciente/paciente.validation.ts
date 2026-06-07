import { z } from 'zod';

export const pacienteValidation = z.object({
    id: z
        .string()
        .optional(),

    nome: z
        .string()
        .trim()
        .min(3, 'Nome obrigatório'),

    email: z
        .string()
        .trim()
        .email('E-mail inválido'),

    cpfCnpj: z
        .string()
        .trim()
        .min(1, 'CPF/CNPJ obrigatório')
        .refine((value) => {
            const digits = value.replace(/\D/g, '');
            return digits.length === 11 || digits.length === 14;
        }, 'CPF/CNPJ inválido'),

    telefone: z
        .string()
        .trim()
        .min(1, 'Telefone obrigatório')
        .refine((value) => {
            const digits = value.replace(/\D/g, '');
            return digits.length >= 10 && digits.length <= 11;
        }, 'Telefone inválido'),

    dataNascimento: z
        .string()
        .trim()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de nascimento inválida'),

    psicologoId: z
        .string()
        .min(1, 'Psicólogo obrigatório'),

    hasPlanoSaude: z
        .boolean()
        .default(false),

    planoSaudeId: z
        .string()
        .trim()
        .optional(),

    numeroCarteirinha: z
        .string()
        .trim()
        .optional(),

    dataValidadeCarteirinha: z
        .string()
        .trim()
        .optional()
}).superRefine((data, context) => {
    if (!data.hasPlanoSaude) {
        return;
    }

    if (!data.planoSaudeId) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["planoSaudeId"],
            message: "Plano de saúde obrigatório"
        });
    }

    if (!data.numeroCarteirinha?.trim()) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["numeroCarteirinha"],
            message: "Número da carteirinha obrigatório"
        });
    }

    if (!data.dataValidadeCarteirinha) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["dataValidadeCarteirinha"],
            message: "Data de validade obrigatória"
        });
    }
});

export type PacienteFormData =
    z.infer<typeof pacienteValidation>;