using HealthMindBackend.Application.MetasTerapeuticas.Commands;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.ValueObjects.Evolucao.MetasTerapeuticas;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.MetasTerapeuticas.Handlers
{
    public class MetaTerapeuticaCreateCommandHandler : IRequestHandler<MetaTerapeuticaCreateCommand, MetaTerapeutica>
    {
        private readonly IHistoricoMedicoRepository _historicoMedicoRepository;

        public MetaTerapeuticaCreateCommandHandler(IHistoricoMedicoRepository historicoMedicoRepository)
        {
            _historicoMedicoRepository = historicoMedicoRepository;
        }

        public async Task<MetaTerapeutica> Handle(MetaTerapeuticaCreateCommand request, CancellationToken cancellationToken)
        {
            var metaTerapeutica = new MetaTerapeutica(request.HistoricoMedicoId,
                request.Titulo, request.StatusMetaTerapeutica,
                request.Observacoes);

            return await _historicoMedicoRepository
                .AdicionarMetaTerapeutica(request.HistoricoMedicoId, metaTerapeutica);
        }
    }
}
