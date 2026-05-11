using AutoMapper;
using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Application.Progressoes.Commands;
using HealthMindBackend.Application.Progressoes.Query;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Services
{
    public class ProgressaoService : IProgressaoService
    {
        private readonly IMapper _mapper;
        private readonly IMediator _mediator;

        public ProgressaoService(IMapper mapper, IMediator mediator)
        {
            _mapper = mapper;
            _mediator = mediator;
        }

        public async Task AdicionarProgressao(ProgressaoDTO progressaoDto)
        {
            var progressaoCreateCommand = _mapper.Map<ProgressaoCreateCommand>(progressaoDto);
            await _mediator.Send(progressaoCreateCommand);
        }

        public async Task ExcluirProgressao(String progressaoId)
        {
            var progressaoDeleteCommand = new ProgressaoDeleteCommand(progressaoId);
            await _mediator.Send(progressaoDeleteCommand);
        }

        public async Task<IEnumerable<ProgressaoDTO>> GetAllProgressoes()
        {
            var getAllProgressoesQuery = new GetAllProgressoesQuery();
            var result = await _mediator.Send(getAllProgressoesQuery);
            return _mapper.Map<IEnumerable<ProgressaoDTO>>(result);
        }

        public async Task<List<ProgressaoDTO>> GetProgressoesByProntuarioId(String prontuarioId)
        {
            var getProgressoesByProntuarioIdQuery = new GetProgressoesByProntuarioIdQuery(prontuarioId);
            var result = await _mediator.Send(getProgressoesByProntuarioIdQuery);
            return _mapper.Map<List<ProgressaoDTO>>(result);
        }
    }
}
