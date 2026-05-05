using HealthMindBackend.Application.Pagamentos.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Pagamentos.Handlers
{
    public class PagamentoUpdateCommandHandler : IRequestHandler<PagamentoUpdateCommand, Pagamento>
    {
        private readonly ISessaoRepository _sessaoRepository;

        public PagamentoUpdateCommandHandler(ISessaoRepository sessaoRepository)
        {
            _sessaoRepository = sessaoRepository;            
        }

        public async Task<Pagamento> Handle(PagamentoUpdateCommand request, CancellationToken cancellationToken)
        {
            var sessaoPagamentoFound = await _sessaoRepository.GetSessaoById(request.SessaoId);

            if (sessaoPagamentoFound == null)
                throw new KeyNotFoundException("Sessão/Pagamento não encontrado");

            sessaoPagamentoFound.Pagamento.Update(request.Valor, request.DataPagamento,
                request.StatusFormaPagamento, request.StatusPagamento, request.StatusParcelado,
                request.TotalParcelas);

            var pagamentoDefinido = await _sessaoRepository.DefinirPagamento(request.SessaoId, sessaoPagamentoFound.Pagamento);

            return pagamentoDefinido;
        }
    }
}
