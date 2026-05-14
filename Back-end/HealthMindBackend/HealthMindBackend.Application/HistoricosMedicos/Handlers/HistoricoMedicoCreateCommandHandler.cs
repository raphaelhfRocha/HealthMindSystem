using HealthMindBackend.Application.HistoricosMedicos.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.HistoricosMedicos.Handlers
{
    public class HistoricoMedicoCreateCommandHandler : IRequestHandler<HistoricoMedicoCreateCommand, HistoricoMedico>
    {
        private readonly IHistoricoMedicoRepository _historicoMedicoRepository;

        public HistoricoMedicoCreateCommandHandler(IHistoricoMedicoRepository historicoMedicoRepository)
        {
            _historicoMedicoRepository = historicoMedicoRepository;
        }

        public async Task<HistoricoMedico> Handle(HistoricoMedicoCreateCommand request, CancellationToken cancellationToken)
        {
            var historicoMedico = new HistoricoMedico(request.PacienteId, request.ProntuarioId, request.Descricao, request.DataRegistro);

            historicoMedico = historicoMedico ??
                throw new ArgumentNullException(nameof(historicoMedico));

            return await _historicoMedicoRepository.AdicionarHistoricoMedico(historicoMedico);
        }
    }
}
