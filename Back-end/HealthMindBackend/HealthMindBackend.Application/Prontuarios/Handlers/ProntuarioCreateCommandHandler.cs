using HealthMindBackend.Application.Prontuarios.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;

namespace HealthMindBackend.Application.Prontuarios.Handlers
{
    public class ProntuarioCreateCommandHandler : IRequestHandler<ProntuarioCreateCommand, Prontuario>
    {
        private readonly IValidator<ProntuarioCreateCommand> _validatorProntuarioCreateCommand;
        private readonly IProntuarioRepository _prontuarioRepository;

        public ProntuarioCreateCommandHandler(IValidator<ProntuarioCreateCommand> validatorProntuarioCreateCommand, IProntuarioRepository prontuarioRepository)
        {
            _validatorProntuarioCreateCommand = validatorProntuarioCreateCommand;
            _prontuarioRepository = prontuarioRepository;
        }

        public async Task<Prontuario> Handle(ProntuarioCreateCommand request, CancellationToken cancellationToken)
        {
            await _validatorProntuarioCreateCommand.ValidateAndThrowAsync(request);

            var prontuario = new Prontuario(
                request.PacienteId,
                request.Descricao,
                request.DataAbertura ?? DateTime.UtcNow,
                request.StatusProntuario,
                request.Medicamentos);

            if (prontuario == null)
                throw new ArgumentNullException(nameof(prontuario));

            var createdProntuario = await _prontuarioRepository.AdicionarProntuario(prontuario);

            return createdProntuario;
        }
    }
}
