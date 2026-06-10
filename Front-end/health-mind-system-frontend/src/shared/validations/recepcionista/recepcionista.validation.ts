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

    cpfCnpj: z
        .string()
        .trim()
        .min(1, 'CPF obrigatório')
        .refine((value) => {
            const digits = value.replace(/\D/g, '');
            return digits.length === 11;
        }, 'CPF inválido'),

    statusCargo: z.nativeEnum(StatusCargoEnum),

    statusRole: z.nativeEnum(StatusRoleEnum)
});

export type RecepcionistaFormData =
    z.infer<typeof recepcionistaValidation>;
