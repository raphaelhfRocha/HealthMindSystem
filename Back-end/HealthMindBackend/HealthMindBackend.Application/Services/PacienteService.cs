using AutoMapper;
using HealthMindBackend.Application.Diagnosticos.Queries;
using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Application.Pacientes.Commands;
using HealthMindBackend.Application.Pacientes.Handlers;
using HealthMindBackend.Application.Pacientes.Queries;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Services
{
    public class PacienteService : IPacienteService
    {
        private readonly IMapper _mapper;
        private readonly IMediator _mediator;

        public PacienteService(IMapper mapper, IMediator mediator)
        {
            _mapper = mapper;
            _mediator = mediator;
        }

        public async Task AtualizarPaciente(PacienteDTO pacienteDto)
        {
            var pacienteUpdareCommand = _mapper.Map<PacienteUpdateCommandHandler>(pacienteDto);
            await _mediator.Send(pacienteUpdareCommand);
        }

        public async Task CadastrarPaciente(PacienteDTO pacienteDto)
        {
            var pacienteCreateCommand = _mapper.Map<PacienteCreateCommandHandler>(pacienteDto);
            await _mediator.Send(pacienteCreateCommand);
        }

        public async Task ExcluirPaciente(String pacienteId)
        {
            var pacienteDeleteCommand = new PacienteDeleteCommand(pacienteId);
            await _mediator.Send(pacienteDeleteCommand);
        }

        public async Task<IEnumerable<PacienteDTO>> GetAllPacientes()
        {
            var getAllPacienteQuery = new GetAllPacientesQuery();
            var result = await _mediator.Send(getAllPacienteQuery);
            return _mapper.Map<IEnumerable<PacienteDTO>>(result);
        }
    }
}
