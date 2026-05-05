using HealthMindBackend.Application.Prontuarios.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using MediatR;
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

        public ProntuarioCreateCommandHandler(IProntuarioRepository prontuarioRepository)
        {
            _prontuarioRepository = prontuarioRepository;
        }

        public async Task<Prontuario> Handle(ProntuarioCreateCommand request, CancellationToken cancellationToken)
        {
            var prontuario = new Prontuario(request.PacienteId, request.Descricao, request.DataAbertura,
                request.StatusProntuario);

            if (prontuario == null)
                throw new ArgumentNullException(nameof(prontuario));

            var createdProntuario = await _prontuarioRepository.AdicionarProntuario(prontuario);

            return createdProntuario;
        }
    }
}