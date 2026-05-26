using FluentValidation;
using HealthMindBackend.Application.Disponibilidades.Commands;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.ValueObjects.Agenda.Disponibilidade;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Disponibilidades.Handlers
{
    public class DisponibilidadeCreateCommandHandler :IRequestHandler<DisponibilidadeCreateCommand, Disponibilidade>
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

            var disponibilidade = new Disponibilidade(request.DataDisponibilidade, request.HoraInicio, request.StatusDisponibilidade)
            {
                PsicologoId = request.PsicologoId
            };

            //var psicologoFound = await _psicologoRepository.GetPsicologoById(request.PsicologoId)
            //    ?? throw new KeyNotFoundException("Psicólogo não encontrado");

            disponibilidade = disponibilidade
                ?? throw new ArgumentNullException(nameof(disponibilidade));

            var disponibilidadeAdicionada = await _psicologoRepository.AdicionarDisponibilidade(request.PsicologoId, disponibilidade);
            return disponibilidadeAdicionada;
        }
    }
}
