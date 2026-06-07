using HealthMindBackend.Application.Disponibilidades.Commands;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.ValueObjects.Agenda.Disponibilidade;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Disponibilidades.Handlers
{
    public class DisponibilidadeDeleteCommandHandler : IRequestHandler<DisponibilidadeDeleteCommand, Disponibilidade>
    {
        private readonly IPsicologoRepository _psicologoRepository;
        private readonly ISessaoRepository _sessaoRepository;
        public DisponibilidadeDeleteCommandHandler(IPsicologoRepository psicologoRepository, ISessaoRepository sessaoRepository)
        {
            _psicologoRepository = psicologoRepository;
            _sessaoRepository = sessaoRepository;
        }

        public async Task<Disponibilidade> Handle(DisponibilidadeDeleteCommand request, CancellationToken cancellationToken)
        {
            var disponibilidadeFound = await _psicologoRepository.GetDisponibilidadeByPsicologoIdAndDisponibilidadeId(request.PsicologoId, request.DisponibilidadeId);

            disponibilidadeFound = disponibilidadeFound ?? throw new KeyNotFoundException("Disponibilidade não encontrada");

            var sessoesFound = await _sessaoRepository.GetSessoesByPsicologoId(request.PsicologoId);

            foreach(var sessao in sessoesFound)
            {
                if(sessao.DataSessao == disponibilidadeFound.DataDisponibilidade &&
                    sessao.HoraInicio == disponibilidadeFound.HoraInicio &&
                    sessao.StatusTipoAtendimento == 
                    disponibilidadeFound.StatusTipoAtendimento)
                {
                    await _sessaoRepository.ExcluirSessao(sessao.Id);
                }
            }

            await _psicologoRepository.ExcluirDisponibilidade(request.PsicologoId, request.DisponibilidadeId);

            return disponibilidadeFound;
        }
    }
}
