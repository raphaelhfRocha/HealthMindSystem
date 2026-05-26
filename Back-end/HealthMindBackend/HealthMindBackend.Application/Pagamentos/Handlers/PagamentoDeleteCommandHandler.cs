using HealthMindBackend.Application.Pagamentos.Commands;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.ValueObjects.Financeiro.Pagamento;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Pagamentos.Handlers
{
    public class PagamentoDeleteCommandHandler : IRequestHandler<PagamentoDeleteCommand, Pagamento>
    {
        private readonly ISessaoRepository _sessaoRepository;

        public PagamentoDeleteCommandHandler(ISessaoRepository sessaoRepository)
        {
            _sessaoRepository = sessaoRepository;            
        }

        public async Task<Pagamento> Handle(PagamentoDeleteCommand request, CancellationToken cancellationToken)
        {
            var sessaoPagamentoFound = await _sessaoRepository.GetSessaoById(request.SessaoId);

            if (sessaoPagamentoFound == null)
                throw new KeyNotFoundException("Sessão/Pagamento não encontrado");

            await _sessaoRepository.RemoverPagamento(request.SessaoId);

            return sessaoPagamentoFound.Pagamento;
        }
    }
}
