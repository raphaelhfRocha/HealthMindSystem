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
    public class DiagnosticoCreateCommandValidator : AbstractValidator<DiagnosticoCreateCommand>
    {
        private readonly IProntuarioRepository _prontuarioRepository;
        private readonly IPacienteRepository _pacienteRepository;

        public DiagnosticoCreateCommandValidator(IProntuarioRepository prontuarioRepository, IPacienteRepository pacienteRepository)
        {
            _prontuarioRepository = prontuarioRepository;
            _pacienteRepository = pacienteRepository;

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
                    return prontuario != null;
                })
                .WithMessage("Prontuario selecionado não está ativo");

            RuleFor(d => d.Cid)
                .NotEmpty().WithMessage("CID Obrigatório")
                .MinimumLength(4).WithMessage("CID deve ter pelo menos 4 caracteres")
                .MaximumLength(5).WithMessage("CID deve ter pelo menos 5 caracteres");

            RuleFor(d => d.DataDiagnostico)
                .NotEmpty().WithMessage("Data Diagnóstico Obrigatória");
        }
    }
}
