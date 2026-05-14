import { z } from 'zod';

export const pagamentoValidation = z.object({
    sessaoId: z
        .string()
        .optional(),

    valor: z
        .number({
            required_error: 'Valor obrigatório'
        })
        .positive('Valor inválido'),

    dataPagamento: z
        .string()
        .min(1, 'Data pagamento obrigatória'),

    formaPagamento: z.number({
        required_error:
            'Forma pagamento obrigatória'
    }),

    statusPagamento: z.number({
        required_error:
            'Status pagamento obrigatório'
    }),

    statusParcelado: z.number({
        required_error:
            'Status parcelado obrigatório'
    }),

    totalParcelas: z
        .number()
        .min(0, 'Total parcelas inválido')
});

export type PagamentoFormData =
    z.infer<typeof pagamentoValidation>;