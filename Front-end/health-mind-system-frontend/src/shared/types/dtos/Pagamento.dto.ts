import { StatusFormaPagamentoEnum } from "shared/enums/statusFormaPagamento.enum";
import { StatusPagamentoEnum } from "shared/enums/statusPagamento.enum";
import { StatusParceladoEnum } from "shared/enums/statusParcelado.enum";

export interface PagamentoDTO {
    sessaoId?: string,
    valor: number,
    dataPagamento: Date,
    statusFormaPagamento: StatusFormaPagamentoEnum,
    statusPagamento: StatusPagamentoEnum,
    statusParcelado: StatusParceladoEnum,
    totalParcelas: number
}