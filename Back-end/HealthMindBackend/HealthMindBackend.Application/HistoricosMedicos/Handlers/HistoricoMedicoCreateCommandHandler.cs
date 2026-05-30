using FluentValidation;
using HealthMindBackend.Application.HistoricosMedicos.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.ValueObjects.Financeiro.Pagamento;
using HealthMindBackend.Domain.ValueObjects.Saude.SaudeMental;
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
        private readonly IValidator<HistoricoMedicoCreateCommand> _validatorHistoricoMedicoCreateCommand;
        private readonly IHistoricoMedicoRepository _historicoMedicoRepository;

        public HistoricoMedicoCreateCommandHandler(IValidator<HistoricoMedicoCreateCommand> validatorHistoricoMedicoCreateCommand, IHistoricoMedicoRepository historicoMedicoRepository)
        {
            _validatorHistoricoMedicoCreateCommand = validatorHistoricoMedicoCreateCommand;
            _historicoMedicoRepository = historicoMedicoRepository;
        }

        public async Task<HistoricoMedico> Handle(HistoricoMedicoCreateCommand request, CancellationToken cancellationToken)
        {
            await _validatorHistoricoMedicoCreateCommand.ValidateAndThrowAsync(request);


            var historicoMedico = new HistoricoMedico(request.PacienteId, request.ProntuarioId,
                request.RazaoAtendimento, request.ImpactoRazao, 
                request.ExpectativaAtendimento,
                request.DataRegistro, request.MetasTerapeuticas);

            var historicoMedicoRegistrado = await _historicoMedicoRepository.AdicionarHistoricoMedico(historicoMedico);

            var saudeMental = new SaudeMental(historicoMedicoRegistrado.Id, request.SaudeMentalCommand.DiagnosticoPrevio, request.SaudeMentalCommand.Acompanhamento, request.SaudeMentalCommand.StatusInternacao, request.SaudeMentalCommand.Antecentes);

            var saudeMentalDefinida = saudeMental != null
                ? await _historicoMedicoRepository.DefinirSaudeMental(historicoMedicoRegistrado.Id, saudeMental)
                : null;

            historicoMedicoRegistrado.SaudeMental = saudeMentalDefinida;

            return historicoMedico;
        }
    }
}
