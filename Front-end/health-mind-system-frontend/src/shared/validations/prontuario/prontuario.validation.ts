import { z } from 'zod';

const medicamentoValidation = z.object({
    id: z
        .string()
        .optional(),

    prontuarioId: z
        .string()
        .optional(),

    nome: z
        .string()
        .min(2, 'Nome do medicamento obrigatório'),

    dosagem: z
        .string()
        .min(1, 'Dosagem obrigatória'),

    frequencia: z
        .string()
        .min(1, 'Frequência obrigatória')
});

export const prontuarioValidation = z.object({
    id: z
        .string()
        .optional(),

    pacienteId: z
        .string()
        .min(1, 'Paciente obrigatório'),

    descricao: z
        .string()
        .min(
            10,
            'Descrição deve possuir no mínimo 10 caracteres'
        )
        .max(
            2000,
            'Descrição muito longa'
        ),

    dataAbertura: z
        .string()
        .min(1, 'Data abertura obrigatória'),

    statusProntuario: z.number({
        required_error:
            'Status prontuário obrigatório'
    }),

    medicamentosDTO: z
        .array(medicamentoValidation)
        .optional()
        .default([])
});

export type ProntuarioFormData =
    z.infer<typeof prontuarioValidation>;

export type MedicamentoFormData =
    z.infer<typeof medicamentoValidation>;