import { z } from 'zod';

export const sessaoValidation = z.object({
    id: z
        .string()
        .optional(),

    pacienteId: z
        .string()
        .min(1, 'Paciente obrigatório'),

    psicologoId: z
        .string()
        .min(1, 'Psicólogo obrigatório'),

    dataSessao: z
        .string()
        .min(1, 'Data sessão obrigatória'),

    horaInicio: z
        .string()
        .min(1, 'Hora sessão obrigatória'),

    observacoes: z
        .string()
        .optional(),

    statusTipoAtendimento: z.number({
        required_error:
            'Tipo atendimento obrigatório'
    }),

    statusSessao: z.number({
        required_error:
            'Status sessão obrigatório'
    })
});

export type SessaoFormData = z.infer<typeof sessaoValidation>;