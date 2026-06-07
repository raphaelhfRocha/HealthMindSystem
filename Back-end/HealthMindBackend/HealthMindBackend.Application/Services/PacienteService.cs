using AutoMapper;
using FluentValidation;
using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Application.Pacientes.Commands;
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
            var pacienteUpdateCommand = _mapper.Map<PacienteUpdateCommand>(pacienteDto);
            await _mediator.Send(pacienteUpdateCommand);
        }

        public async Task CadastrarPaciente(PacienteDTO pacienteDto)
        {
            var pacienteCreateCommand = _mapper.Map<PacienteCreateCommand>(pacienteDto);
            await _mediator.Send(pacienteCreateCommand);
        }

        public async Task<IEnumerable<PacienteDTO>> GetAllPacientes()
        {
            var getAllPacienteQuery = new GetAllPacientesQuery();
            var result = await _mediator.Send(getAllPacienteQuery);
            return _mapper.Map<IEnumerable<PacienteDTO>>(result);
        }

        public async Task<PacienteDTO> GetPacienteById(String id)
        {
            var getPacienteByIdQuery = new GetPacienteByIdQuery(id);
            var result = await _mediator.Send(getPacienteByIdQuery);
            return _mapper.Map<PacienteDTO>(result);
        }

        public async Task<List<PacienteDTO>> GetPacientesByNome(String nome)
        {
            var getPacientesByNomeQuery = new GetPacientesByNomeQuery(nome);
            var result = await _mediator.Send(getPacientesByNomeQuery);
            return _mapper.Map<List<PacienteDTO>>(result);
        }

        public async Task<List<PacienteDTO>> GetPacientesByPsicologoId(String? psicologoId)
        {
            var getPacientesByPsicologoIdQuery = new GetPacientesByPsicologoIdQuery(psicologoId);
            var result = await _mediator.Send(getPacientesByPsicologoIdQuery);
            return _mapper.Map<List<PacienteDTO>>(result);
        }
    }
}
