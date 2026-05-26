using FluentValidation;
using HealthMindBackend.Application.Prontuarios.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Prontuarios.Handlers
{
    public class ProntuarioUpdateCommandHandler : IRequestHandler<ProntuarioUpdateCommand, Prontuario>
    {
        private readonly IValidator<ProntuarioUpdateCommand> _validatorProntuarioUpdateCommand;
        private readonly IProntuarioRepository _prontuarioRepository;

        public ProntuarioUpdateCommandHandler(IValidator<ProntuarioUpdateCommand> validatorProntuarioUpdateCommand, IProntuarioRepository prontuarioRepository)
        {
            _validatorProntuarioUpdateCommand = validatorProntuarioUpdateCommand;
            _prontuarioRepository = prontuarioRepository;
        }

        public async Task<Prontuario> Handle(ProntuarioUpdateCommand request, CancellationToken cancellationToken)
        {
            await _validatorProntuarioUpdateCommand.ValidateAndThrowAsync(request);

            var prontuarioFound = await _prontuarioRepository.GetProntuarioById(request.Id);

            if (prontuarioFound == null)
                throw new KeyNotFoundException("Prontuario não encontrado.");

            prontuarioFound.Update(request.PacienteId, request.Descricao, request.StatusProntuario);

            return await _prontuarioRepository.EditarProntuario(prontuarioFound);
        }
    }
}
