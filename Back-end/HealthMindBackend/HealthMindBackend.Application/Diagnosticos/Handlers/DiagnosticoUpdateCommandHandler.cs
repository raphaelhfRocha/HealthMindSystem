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
    public class DiagnosticoUpdateCommandHandler : IRequestHandler<DiagnosticoUpdateCommand, Diagnostico>
    {
        private readonly IPacienteRepository _pacienteRepository;
        private readonly IProntuarioRepository _prontuarioRepository;
        private readonly IDiagnosticoRepository _diagnosticoRepository;

        public DiagnosticoUpdateCommandHandler(IPacienteRepository pacienteRepository, IProntuarioRepository prontuarioRepository, IDiagnosticoRepository diagnosticoRepository)
        {
            _pacienteRepository = pacienteRepository;
            _prontuarioRepository = prontuarioRepository;
            _diagnosticoRepository = diagnosticoRepository;
        }

        public async Task<Diagnostico> Handle(DiagnosticoUpdateCommand request, CancellationToken cancellationToken)
        {
            var pacienteFound = await _pacienteRepository.GetPacienteById(request.PacienteId);

            if (pacienteFound == null)
                throw new KeyNotFoundException("Paciente não encontrado");

            var prontuarioFound = await _prontuarioRepository.GetProntuarioById(request.ProntuarioId);

            if (prontuarioFound == null)
                throw new KeyNotFoundException("Prontuario não encontrado");

            var diagnosticoFound = await _diagnosticoRepository.GetDiagnosticoById(request.Id);

            if (diagnosticoFound == null)
                throw new KeyNotFoundException("Diagnóstico não encontrado");

            diagnosticoFound.Update(request.PacienteId, request.ProntuarioId, request.Descricao,
                request.Cid, request.DataDiagnostico, request.StatusDiagnostico, request.Observacoes);

            return await _diagnosticoRepository.EditarDiagnostico(request.Id, diagnosticoFound);
        }
    }
}
