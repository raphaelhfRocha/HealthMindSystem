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
    public class MetaTerapeuticaUpdateCommandHandler : IRequestHandler<MetaTerapeuticaUpdateCommand, MetaTerapeutica>
    {
        private readonly IHistoricoMedicoRepository _historicoMedicoRepository;

        public MetaTerapeuticaUpdateCommandHandler(IHistoricoMedicoRepository historicoMedicoRepository)
        {
            _historicoMedicoRepository = historicoMedicoRepository;
        }

        public async Task<MetaTerapeutica> Handle(MetaTerapeuticaUpdateCommand request, CancellationToken cancellationToken)
        {
            var metaTerapeuticaFound = await _historicoMedicoRepository.GetMetaTerapeuticaByHistoricoMedicoIdAndMetaTerapeuticaId(request.HistoricoMedicoId, request.Id);

            metaTerapeuticaFound = metaTerapeuticaFound ??
                throw new KeyNotFoundException("Meta Terapeutica não encontrada");

            metaTerapeuticaFound.Update(request.Titulo, request.StatusMetaTerapeutica, request.Observacoes);

            return await _historicoMedicoRepository.EditarMetaTerapeutica(request.HistoricoMedicoId, request.Id, metaTerapeuticaFound);
        }
    }
}
