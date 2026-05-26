using FluentValidation;
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
    public class HistoricoMedicoUpdateCommandHandler : IRequestHandler<HistoricoMedicoUpdateCommand, HistoricoMedico>
    {
        private readonly IValidator<HistoricoMedicoUpdateCommand> _validatorHistoricoMedicoUpdateCommand;
        private readonly IHistoricoMedicoRepository _historicoMedicoRepository;

        public HistoricoMedicoUpdateCommandHandler(IValidator<HistoricoMedicoUpdateCommand> validatorHistoricoMedicoUpdateCommand, IHistoricoMedicoRepository historicoMedicoRepository)
        {
            _validatorHistoricoMedicoUpdateCommand = validatorHistoricoMedicoUpdateCommand;
            _historicoMedicoRepository = historicoMedicoRepository;
        }

        public async Task<HistoricoMedico> Handle(HistoricoMedicoUpdateCommand request, CancellationToken cancellationToken)
        {
            await _validatorHistoricoMedicoUpdateCommand.ValidateAndThrowAsync(request);

            var historicoMedicoFound = await _historicoMedicoRepository.GetHistoricoById(request.Id);

            historicoMedicoFound = historicoMedicoFound ??
                throw new KeyNotFoundException("Historico médico não encontrado.");
            
            historicoMedicoFound.Update(request.Id, request.PacienteId, request.ProntuarioId, request.Descricao, request.DataRegistro);

            var historicoMedicoEditado = await _historicoMedicoRepository.EditarHistoricoMedico(request.Id, historicoMedicoFound);
            return historicoMedicoEditado;
        }
    }
}
