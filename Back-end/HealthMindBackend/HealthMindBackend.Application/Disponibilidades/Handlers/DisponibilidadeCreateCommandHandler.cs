using FluentValidation;
using HealthMindBackend.Application.Disponibilidades.Commands;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.Validations;
using HealthMindBackend.Domain.ValueObjects.Agenda.Disponibilidade;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Disponibilidades.Handlers
{
    public class DisponibilidadeCreateCommandHandler : IRequestHandler<DisponibilidadeCreateCommand, Disponibilidade>
    {
        private readonly IValidator<DisponibilidadeCreateCommand> _validatorDisponibilidadeCreateCommand;
        private readonly IPsicologoRepository _psicologoRepository;

        public DisponibilidadeCreateCommandHandler(IValidator<DisponibilidadeCreateCommand> validatorDisponibilidadeCreateCommand, IPsicologoRepository psicologoRepository)
        {
            _validatorDisponibilidadeCreateCommand = validatorDisponibilidadeCreateCommand;
            _psicologoRepository = psicologoRepository;
        }

        public async Task<Disponibilidade> Handle(DisponibilidadeCreateCommand request, CancellationToken cancellationToken)
        {
            await _validatorDisponibilidadeCreateCommand.ValidateAndThrowAsync(request);

            var dataDisponibilidade = DateOnly.FromDateTime(request.DataDisponibilidade);
            var dataHoraDisponibilidade = dataDisponibilidade.ToDateTime(TimeOnly.FromTimeSpan(request.HoraInicio));

            if (dataHoraDisponibilidade < DateTime.Now)
                throw new DomainExceptionValidation("A disponibilidade não pode ser anterior a data/hora atual");

            var disponibilidadesFound =
                await _psicologoRepository.GetDisponibilidadesByPsicologoId(request.PsicologoId);

            if (disponibilidadesFound != null)
            {
                foreach (var disponibilidadeFound in disponibilidadesFound)
                {
                    if (request.PsicologoId == disponibilidadeFound.PsicologoId &&
                        request.DataDisponibilidade == disponibilidadeFound.DataDisponibilidade &&
                        request.HoraInicio == disponibilidadeFound.HoraInicio)
                    {
                        throw new DomainExceptionValidation("Disponibilidade já registrada.");
                    }
                }
            }

            var disponibilidade = new Disponibilidade(
                request.PsicologoId,
                request.DataDisponibilidade,
                request.HoraInicio,
                request.StatusTipoAtendimento
            );

            var disponibilidadeAdicionada = await _psicologoRepository.AdicionarDisponibilidade(request.PsicologoId, disponibilidade);
            return disponibilidadeAdicionada;
        }
    }
}