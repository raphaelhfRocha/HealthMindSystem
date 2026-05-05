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
    public class ProgressaoDeleteCommandHandler : IRequestHandler<ProgressaoDeleteCommand, Progressao>
    {
        private readonly IProgressaoRepository _progressaoRepository;
        private readonly IProntuarioRepository _prontuarioRepository;
        private readonly IPacienteRepository _pacienteRepository;

        public ProgressaoDeleteCommandHandler(IProgressaoRepository progressaoRepository, IProntuarioRepository prontuarioRepository, IPacienteRepository pacienteRepository)
        {
            _progressaoRepository = progressaoRepository;
            _prontuarioRepository = prontuarioRepository;
            _pacienteRepository = pacienteRepository;
        }

        public async Task<Progressao> Handle(ProgressaoDeleteCommand request, CancellationToken cancellationToken)
        {
            var pacienteFound = await _pacienteRepository.GetPacienteById(request.PacienteId);

            if (pacienteFound == null)
                throw new KeyNotFoundException("Paciente não encontrado");

            var prontuarioFound = await _prontuarioRepository.GetProntuarioById(request.ProntuarioId);

            if (prontuarioFound == null)
                throw new KeyNotFoundException("Prontuario não encontrado");

            var progressaoFound = await _progressaoRepository.GetProgressaoById(request.Id);

            if (progressaoFound == null)
                throw new KeyNotFoundException("Progressão não encontrada");

            await _progressaoRepository.ExcluirProgressao(request.Id);

            return progressaoFound;
        }
    }
}