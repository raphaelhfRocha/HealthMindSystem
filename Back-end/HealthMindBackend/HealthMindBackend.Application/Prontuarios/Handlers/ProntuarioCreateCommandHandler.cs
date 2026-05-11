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

namespace HealthMindBackend.Application.Prontuarios.Handlers
{
    public class ProntuarioCreateCommandHandler : IRequestHandler<ProntuarioCreateCommand, Prontuario>
    {
        private readonly IProntuarioRepository _prontuarioRepository;
        private readonly ILogger<ProntuarioCreateCommandHandler> _logger;

        public ProntuarioCreateCommandHandler(IProntuarioRepository prontuarioRepository, ILogger<ProntuarioCreateCommandHandler> logger)
        {
            _prontuarioRepository = prontuarioRepository;
            _logger = logger;
        }

        public async Task<Prontuario> Handle(ProntuarioCreateCommand request, CancellationToken cancellationToken)
        {
            var prontuario = new Prontuario(request.PacienteId, request.Descricao,
                request.StatusProntuario);

            try
            {
                var json = JsonSerializer.Serialize(prontuario, new JsonSerializerOptions { WriteIndented = true });
                _logger?.LogInformation("Prontuario before insert: {json}", json);
            }
            catch { }

            if (prontuario == null)
                throw new ArgumentNullException(nameof(prontuario));

            var createdProntuario = await _prontuarioRepository.AdicionarProntuario(prontuario);

            return createdProntuario;
        }
    }
}