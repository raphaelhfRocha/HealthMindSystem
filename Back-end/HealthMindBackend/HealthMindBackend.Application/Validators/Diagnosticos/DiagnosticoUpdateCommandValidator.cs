using FluentValidation;
using HealthMindBackend.Application.Diagnosticos.Commands;
using HealthMindBackend.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Validators.Diagnosticos
{
    public class DiagnosticoUpdateCommandValidator : AbstractValidator<DiagnosticoUpdateCommand>
    {
        private readonly IDiagnosticoRepository _diagnosticoRepository;
        private readonly IPacienteRepository _pacienteRepository;
        private readonly IProntuarioRepository _prontuarioRepository;

        public DiagnosticoUpdateCommandValidator(IDiagnosticoRepository diagnosticoRepository, IPacienteRepository pacienteRepository, IProntuarioRepository prontuarioRepository)
        {
            _diagnosticoRepository = diagnosticoRepository;
            _pacienteRepository = pacienteRepository;
            _prontuarioRepository = prontuarioRepository;

            RuleFor(d => d.Id)
                .NotEmpty().WithMessage("Id Diagnóstico não pode ser nulo");

            RuleFor(d => d.Descricao)
                .NotEmpty().WithMessage("Descrição Diagnóstico é obrigatório");

            RuleFor(d => d.PacienteId)
                .NotEmpty().WithMessage("Paciente Obrigatório")
                .MustAsync(async (pacienteId, cancellationToken) =>
                {
                    var paciente = await _pacienteRepository.GetPacienteById(pacienteId);
                    return paciente != null;
                })
                .WithMessage("Paciente selecionado não está ativo");

            RuleFor(d => d.ProntuarioId)
                .NotEmpty().WithMessage("Prontuário Obrigatório")
                .MustAsync(async (prontuarioId, cancellationToken) =>
                {
                    var prontuario = await _prontuarioRepository.GetProntuarioById(prontuarioId);
                    var paciente = await _pacienteRepository.GetPacienteById(prontuario.PacienteId);
                    return prontuario != null && paciente != null;
                })
                .WithMessage("Prontuario selecionado não está ativo");

            RuleFor(d => d.Cid.Codigo)
                .NotEmpty().WithMessage("CID Obrigatório")
                .MinimumLength(4).WithMessage("CID deve ter pelo menos 4 caracteres")
                .MaximumLength(5).WithMessage("CID deve ter pelo menos 5 caracteres");

            RuleFor(d => d.DataDiagnostico)
                .NotEmpty().WithMessage("Data Diagnóstico Obrigatória");
        }
    }
}
