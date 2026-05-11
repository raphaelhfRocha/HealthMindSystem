using AutoMapper;
using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Application.Psicologos.Commands;
using HealthMindBackend.Application.Psicologos.Queries;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Services
{
    public class PsicologoService : IPsicologoService
    {
        private readonly IMapper _mapper;
        private readonly IMediator _mediator;

        public PsicologoService(IMapper mapper, IMediator mediator)
        {
            _mapper = mapper;
            _mediator = mediator;
        }

        public async Task AtualizarPsicologo(PsicologoDTO psicologoDto)
        {
            var psiologoUpdateCommand = _mapper.Map<PsicologoUpdateCommand>(psicologoDto);
            await _mediator.Send(psiologoUpdateCommand);
        }

        public async Task CadastrarPsicologo(PsicologoDTO psicologoDto)
        {
            var psicologoCreateCommand = _mapper.Map<PsicologoCreateCommand>(psicologoDto);
            await _mediator.Send(psicologoCreateCommand);
        }

        public async Task ExcluirPsicologo(String psicologoId)
        {
            var psicologoDeleteCommand = new PsicologoDeleteCommand(psicologoId);
            await _mediator.Send(psicologoDeleteCommand);
        }

        public async Task<IEnumerable<PsicologoDTO>> GetAllPsicologos()
        {
            var getAllPsicologosQuery = new GetAllPsicologosQuery();
            var result = await _mediator.Send(getAllPsicologosQuery);
            return _mapper.Map<IEnumerable<PsicologoDTO>>(result);
        }
    }
}
