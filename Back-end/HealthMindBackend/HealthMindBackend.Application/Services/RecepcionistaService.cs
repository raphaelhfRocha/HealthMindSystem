using AutoMapper;
using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Application.Recepcionistas.Commands;
using HealthMindBackend.Application.Usuarios.Commands;
using HealthMindBackend.Application.Usuarios.Queries;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Services
{
    public class RecepcionistaService : IRecepcionistaService
    {
        private readonly IMapper _mapper;
        private readonly IMediator _mediator;

        public RecepcionistaService(IMapper mapper, IMediator mediator)
        {
            _mapper = mapper;
            _mediator = mediator;
        }

        public async Task AtualizarRecepcionista(RecepcionistaDTO recepcionistaDto)
        {
            var recepcionistaUpdateCommand = _mapper.Map<RecepcionistaUpdateCommand>(recepcionistaDto);
            await _mediator.Send(recepcionistaUpdateCommand);
        }

        public async Task CadastrarRecepcionista(RecepcionistaDTO recepcionistaDto)
        {
            var recepcionistaCreateCommand = _mapper.Map<RecepcionistaCreateCommand>(recepcionistaDto);
            await _mediator.Send(recepcionistaCreateCommand);
        }

        public async Task ExcluirRecepcionista(String recepcionistaId)
        {
            var recepcionistaDeleteCommand = new RecepcionistaDeleteCommand(recepcionistaId);
            await _mediator.Send(recepcionistaDeleteCommand);
        }

        public async Task<IEnumerable<RecepcionistaDTO>> GetAllRecepcionistas()
        {
            var getAllRecepcionistasQuery = new GetAllRecepcionistasQuery();
            var result = await _mediator.Send(getAllRecepcionistasQuery);
            return _mapper.Map<IEnumerable<RecepcionistaDTO>>(result);
        }
    }
}
