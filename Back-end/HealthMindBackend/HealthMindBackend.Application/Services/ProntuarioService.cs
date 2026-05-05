using AutoMapper;
using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Application.Prontuarios.Commands;
using HealthMindBackend.Application.Prontuarios.Handlers;
using HealthMindBackend.Application.Prontuarios.Queries;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Services
{
    public class ProntuarioService : IProntuarioService
    {
        private readonly IMapper _mapper;
        private readonly IMediator _mediator;

        public ProntuarioService(IMapper mapper, IMediator mediator)
        {
            _mapper = mapper;
            _mediator = mediator;
        }

        public async Task EditarProntuario(ProntuarioDTO prontuarioDto)
        {
            var prontuarioUpdateCommand = _mapper.Map<ProntuarioUpdateCommand>(prontuarioDto);
            await _mediator.Send(prontuarioUpdateCommand);
        }

        public async Task<IEnumerable<ProntuarioDTO>> GetAllProntuarios()
        {
            var getAllProntuariosQuery = new GetAllProntuariosQuery();
            var result = await _mediator.Send(getAllProntuariosQuery);
            return _mapper.Map<IEnumerable<ProntuarioDTO>>(result);
        }

        public async Task RegistrarProntuario(ProntuarioDTO prontuarioDto)
        {
            var prontuarioCreateCommand = _mapper.Map<ProntuarioCreateCommandHandler>(prontuarioDto);
            await _mediator.Send(prontuarioCreateCommand);
        }
    }
}
