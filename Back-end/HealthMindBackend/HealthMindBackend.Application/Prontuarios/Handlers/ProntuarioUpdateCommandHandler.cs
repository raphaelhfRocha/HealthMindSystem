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
        private readonly IProntuarioRepository _prontuarioRepository;
        private readonly ILogger<ProntuarioCreateCommandHandler> _logger;

        public ProntuarioUpdateCommandHandler(IProntuarioRepository prontuarioRepository, ILogger<ProntuarioCreateCommandHandler> logger)
        {
            _prontuarioRepository = prontuarioRepository;
            _logger = logger;
        }

        public async Task<Prontuario> Handle(ProntuarioUpdateCommand request, CancellationToken cancellationToken)
        {
            var prontuarioFound = await _prontuarioRepository.GetProntuarioById(request.Id);

            if (prontuarioFound == null)
                throw new KeyNotFoundException("Prontuario não encontrado.");

            prontuarioFound.Update(request.PacienteId, request.Descricao, request.StatusProntuario);

            try
            {
                var json = JsonSerializer.Serialize(prontuarioFound, new JsonSerializerOptions { WriteIndented = true });
                _logger?.LogInformation("Prontuario before insert: {json}", json);
            }
            catch { }

            return await _prontuarioRepository.EditarProntuario(prontuarioFound);
        }
    }
}
