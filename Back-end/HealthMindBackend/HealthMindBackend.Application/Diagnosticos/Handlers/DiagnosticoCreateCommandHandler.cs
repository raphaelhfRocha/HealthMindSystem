using FluentValidation;
using HealthMindBackend.Application.Diagnosticos.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Diagnosticos.Handlers
{
    public class DiagnosticoCreateCommandHandler : IRequestHandler<DiagnosticoCreateCommand, Diagnostico>
    {
        private readonly IValidator<DiagnosticoCreateCommand> _validatorDiagnosticoCreateCommand;
        private readonly IDiagnosticoRepository _diagnosticoRepository;

        public DiagnosticoCreateCommandHandler(IValidator<DiagnosticoCreateCommand> validatorDiagnosticoCreateCommand, IDiagnosticoRepository diagnosticoRepository)
        {
            _validatorDiagnosticoCreateCommand = validatorDiagnosticoCreateCommand;
            _diagnosticoRepository = diagnosticoRepository;            
        }

        public async Task<Diagnostico> Handle(DiagnosticoCreateCommand request, CancellationToken cancellationToken)
        {
            await _validatorDiagnosticoCreateCommand.ValidateAndThrowAsync(request);

            var diagnostico = new Diagnostico(request.PacienteId, request.ProntuarioId, request.Descricao,
                request.Cid, request.DataDiagnostico, request.StatusDiagnostico, request.Observacoes);

            if (diagnostico == null)
                throw new ArgumentNullException(nameof(diagnostico));

            return await _diagnosticoRepository.AdicionarDiagnostico(diagnostico);
        }
    }
}
