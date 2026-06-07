using HealthMindBackend.Application.Sessoes.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Sessoes.Handlers
{
    public class SessaoDeleteCommandHandler : IRequestHandler<SessaoDeleteCommand, Sessao>
    {
        private readonly ISessaoRepository _sessaoRepository;
        private readonly IPsicologoRepository _psicologoRepository;

        public SessaoDeleteCommandHandler(ISessaoRepository sessaoRepository, IPsicologoRepository psicologoRepository)
        {
            _sessaoRepository = sessaoRepository;
            _psicologoRepository = psicologoRepository;
        }

        public async Task<Sessao> Handle(SessaoDeleteCommand request, CancellationToken cancellationToken)
        {
            var sessaoFound = await _sessaoRepository.GetSessaoById(request.Id);

            var disponibilidades = await _psicologoRepository.GetDisponibilidadesByPsicologoId(sessaoFound.PsicologoId);

            if (disponibilidades != null)
            {
                foreach (var disponibilidade in disponibilidades)
                {
                    if (sessaoFound.DataSessao == disponibilidade.DataDisponibilidade && // Verifica/compara a sessão a agendar com os dados atuais com a disponibilidade e muda o status para reservada caso atenda a condição
                        sessaoFound.HoraInicio == disponibilidade.HoraInicio &&
                        disponibilidade.StatusDisponibilidade == StatusDisponibilidadeEnum.StsReservada)
                    {
                        disponibilidade.UpdateStatusDisponibilidadeToDisponivel();
                        var statusDiponibilidadeAlterada =
                            await _psicologoRepository.AlterarStatusDisponibilidade(sessaoFound.PsicologoId, disponibilidade.Id, disponibilidade);
                    }
                }
            }

            await _sessaoRepository.ExcluirSessao(request.Id);

            return sessaoFound;
        }
    }
}
