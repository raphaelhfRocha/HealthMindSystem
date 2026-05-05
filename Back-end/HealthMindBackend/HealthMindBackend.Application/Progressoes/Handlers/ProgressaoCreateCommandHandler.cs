using HealthMindBackend.Application.Progressoes.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Progressoes.Handlers
{
    public class ProgressaoCreateCommandHandler : IRequestHandler<ProgressaoCreateCommand, Progressao>
    {
        private readonly IProgressaoRepository _progressaoRepository;

        public ProgressaoCreateCommandHandler(IProgressaoRepository progressaoRepository)
        {
            _progressaoRepository = progressaoRepository;
        }

        public async Task<Progressao> Handle(ProgressaoCreateCommand request, CancellationToken cancellationToken)
        {
            var progressao = new Progressao(request.PacienteId, request.ProntuarioId,
                request.Descricao, request.DataRegistro);

            if (progressao == null)
                throw new ArgumentNullException(nameof(progressao));

            var createdProgressao = await _progressaoRepository.AdicionarProgressao(progressao);

            return createdProgressao;
        }
    }
}
