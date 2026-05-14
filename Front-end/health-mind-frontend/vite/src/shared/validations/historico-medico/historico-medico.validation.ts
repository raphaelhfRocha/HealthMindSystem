import { z } from 'zod';

export const historicoMedicoValidation = z.object({
    id: z
        .string()
        .optional(),

    pacienteId: z
        .string()
        .min(1, 'Paciente obrigatório'),

    prontuarioId: z
        .string()
        .min(1, 'Prontuário obrigatório'),

    descricao: z
        .string()
        .min(10, 'Descrição obrigatória')
        .max(3000, 'Descrição muito longa'),

    dataRegistro: z
        .string()
        .min(1, 'Data registro obrigatória')
});

export type HistoricoMedicoFormData =
    z.infer<typeof historicoMedicoValidation>;