import { z } from 'zod';
import { StatusCargoEnum } from "../../domain/enums/status-cargo.enum";
import { StatusRoleEnum } from "../../domain/enums/status-role.enum";

export const recepcionistaValidation = z.object({
    id: z
        .string()
        .optional(),

    nome: z
        .string()
        .trim()
        .min(8, 'Nome obrigatório (mínimo 8 caracteres)'),

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

    statusCargo: z.nativeEnum(StatusCargoEnum),

    statusRole: z.nativeEnum(StatusRoleEnum)
});

export type RecepcionistaFormData =
    z.infer<typeof recepcionistaValidation>;
