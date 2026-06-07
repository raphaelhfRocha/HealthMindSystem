using AutoMapper;
using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.HistoricosMedicos.Commands;
using HealthMindBackend.Application.HistoricosMedicos.Queries;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Application.Medicamentos.Commands;
using HealthMindBackend.Application.MetasTerapeuticas.Commands;
using HealthMindBackend.Application.MetasTerapeuticas.Queries;
using HealthMindBackend.Application.SaudesMentais.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.ValueObjects.Saude.Medicamento;
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
            var historicoMedicoCreateCommand = _mapper.Map<HistoricoMedicoCreateCommand>(historicoMedicoDto);
            await _mediator.Send(historicoMedicoCreateCommand);
        }

        public async Task AdicionarMetaTerapeutica(MetaTerapeuticaDTO metaTerapeuticaDto)
        {
            var metaTerapeuticaCreateCommand = _mapper.Map<MetaTerapeuticaCreateCommand>(metaTerapeuticaDto);
            await _mediator.Send(metaTerapeuticaCreateCommand);
        }

        public async Task AlterarMetaTerapeutica(String historicoId, String metaTerapeuticaId, MetaTerapeuticaDTO metaTerapeuticaDto)
        {
            var metaTerapeuticaUpdateCommand = _mapper.Map<MetaTerapeuticaUpdateCommand>(metaTerapeuticaDto);
            metaTerapeuticaUpdateCommand.HistoricoMedicoId = historicoId;
            metaTerapeuticaUpdateCommand.Id = metaTerapeuticaId;
            await _mediator.Send(metaTerapeuticaUpdateCommand);
        }

        public async Task AtualizarHistoricoMedico(HistoricoMedicoDTO historicoMedicoDto)
        {
            var historicoMedicoUpdateCommand = _mapper.Map<HistoricoMedicoUpdateCommand>(historicoMedicoDto);
            await _mediator.Send(historicoMedicoUpdateCommand);
        }

        public async Task ExcluirHistoricoMedico(String historicoId)
        {
            var historicoMedicoDeleteCommand = new HistoricoMedicoDeleteCommand(historicoId);
            await _mediator.Send(historicoMedicoDeleteCommand);
        }

        public async Task ExcluirSaudeMental(String historicoId)
        {
            var saudeMentalDeleteCommand = new SaudeMentalDeleteCommand(historicoId);
            await _mediator.Send(saudeMentalDeleteCommand);
        }

        public async Task<IEnumerable<HistoricoMedicoDTO>> GetAllHistoricoMedicos()
        {
            var getAllHistoricosMedicos = new GetAllHistoricosQuery();
            var result = await _mediator.Send(getAllHistoricosMedicos);
            return _mapper.Map<IEnumerable<HistoricoMedicoDTO>>(result);
        }

        public async Task<List<HistoricoMedicoDTO>> GetHistoricosByProntuarioId(String prontuarioId)
        {
            var getHistoricosByProntuarioId = new GetHistoricosByProntuarioIdQuery(prontuarioId);
            var result = await _mediator.Send(getHistoricosByProntuarioId);
            return _mapper.Map<List<HistoricoMedicoDTO>>(result);
        }

        public async Task<List<MetaTerapeuticaDTO>> GetMetaTerapeuticasByHistoricoMedicoId(String historicoId)
        {
            var getMetasTerapeuticasByHistoricoMedicoIdQuery = new GetMetasTerapeuticasByHistoricoMedicoIdQuery(historicoId);
            var result = await _mediator.Send(getMetasTerapeuticasByHistoricoMedicoIdQuery);
            return _mapper.Map<List<MetaTerapeuticaDTO>>(result);
        }
    }
}
