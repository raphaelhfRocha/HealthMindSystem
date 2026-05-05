using AutoMapper;
using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.HistoricosMedicos.Handlers;
using HealthMindBackend.Application.HistoricosMedicos.Queries;
using HealthMindBackend.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Services
{
    public class HistoricoMedicoService : IHistoricoMedicoService
    {
        private readonly IMapper _mapper;
        private readonly IMediator _mediator;

        public HistoricoMedicoService(IMapper mapper, IMediator mediator)
        {
            _mapper = mapper;
            _mediator = mediator;
        }

        public async Task AdicionarHistoricoMedico(HistoricoMedicoDTO historicoMedicoDto)
        {
            var historicoMedicoCreateCommand = _mapper.Map<HistoricoMedicoCreateCommandHandler>(historicoMedicoDto);
            await _mediator.Send(historicoMedicoCreateCommand);
        }

        public async Task AtualizarHistoricoMedico(HistoricoMedicoDTO historicoMedicoDto)
        {
            var historicoMedicoUpdateCommand = _mapper.Map<HistoricoMedicoUpdateCommandHandler>(historicoMedicoDto);
            await _mediator.Send(historicoMedicoUpdateCommand);
        }

        public async Task<IEnumerable<HistoricoMedicoDTO>> GetAllHistoricoMedicos()
        {
            var getAllHistoricosMedicos = new GetAllHistoricosQuery();
            var result = await _mediator.Send(getAllHistoricosMedicos);
            return _mapper.Map<IEnumerable<HistoricoMedicoDTO>>(result);
        }

        public async Task<IEnumerable<HistoricoMedicoDTO>> GetHistoricosByProntuarioId(String prontuarioId)
        {
            var getHistoricosByProntuarioId = new GetHistoricosByProntuarioIdQuery(prontuarioId);
            var result = await _mediator.Send(getHistoricosByProntuarioId);
            return _mapper.Map<IEnumerable<HistoricoMedicoDTO>>(result);
        }
    }
}
