using FluentValidation;
using HealthMindBackend.Application.HistoricosMedicos.Commands;
using HealthMindBackend.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Validators.HistoricosMedicos
{
    public class HistoricoMedicoUpdateCommandValidator : AbstractValidator<HistoricoMedicoUpdateCommand>
    {
        private readonly IPacienteRepository _pacienteRepository;
        private readonly IProntuarioRepository _prontuarioRepository;

        public HistoricoMedicoUpdateCommandValidator(IPacienteRepository pacienteRepository, IProntuarioRepository prontuarioRepository)
        {
            _pacienteRepository = pacienteRepository;
            _prontuarioRepository = prontuarioRepository;

            RuleFor(h => h.Id)
                .NotEmpty().WithMessage("Id Histórico Médico obrigatório");

            RuleFor(h => h.PacienteId)
                .NotEmpty().WithMessage("Id Paciente obrigatório")
                .MustAsync(async (historicoMedicoCreateCommand, none, cancellationToken) =>
                {
                    var pacienteExist = await _pacienteRepository.GetPacienteById(historicoMedicoCreateCommand.PacienteId);
                    return pacienteExist != null;
                })
                .WithMessage("O Paciente não existe para registro do histórico médico");

            RuleFor(h => h.ProntuarioId)
                .NotEmpty().WithMessage("Id Prontuário obrigatório")
                .MustAsync(async (historicoMedicoCreateCommand, none, cancellationToken) =>
                {
                    var prontuarioExist = await _prontuarioRepository.GetProntuarioById(historicoMedicoCreateCommand.ProntuarioId);
                    var pacienteExist = await _pacienteRepository.GetPacienteById(historicoMedicoCreateCommand.PacienteId);
                    return prontuarioExist != null && pacienteExist != null;
                })
                .WithMessage("O Prontuario/Paciente não existe para registro do histórico médico");

            RuleFor(h => h.Descricao)
                .NotEmpty().WithMessage("Descrição obrigatória");

            RuleFor(h => h.DataRegistro)
                .NotEmpty().WithMessage("Data Registro obrigatória");
        }
    }
}
