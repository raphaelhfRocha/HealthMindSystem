import { z } from 'zod';
import { StatusCargoEnum } from "../../domain/enums/status-cargo.enum";
import { StatusRoleEnum } from "../../domain/enums/status-role.enum";

export const psicologoValidation = z.object({
    id: z
        .string()
        .optional(),

    nome: z
        .string()
        .trim()
        .min(3, 'Nome obrigatório'),

    cpfCnpj: z
        .string()
        .trim()
        .min(1, 'CPF/CNPJ obrigatório')
        .refine((value) => {
            const digits = value.replace(/\D/g, '');
            return digits.length === 11 || digits.length === 14;
        }, 'CPF/CNPJ inválido'),

    crp: z
        .string()
        .trim()
        .regex(/^\d{2}\/\d{4,6}$/, 'CRP inválido'),

    especialidade: z
        .string()
        .trim()
        .min(3, 'Especialidade obrigatória'),

    valorConsulta: z
        .coerce
        .number({ invalid_type_error: 'Valor inválido' })
        .min(0, 'Valor da consulta inválido'),

    statusCargo: z.nativeEnum(StatusCargoEnum),

    statusRole: z.nativeEnum(StatusRoleEnum)
});

export type PsicologoFormData =
    z.infer<typeof psicologoValidation>;