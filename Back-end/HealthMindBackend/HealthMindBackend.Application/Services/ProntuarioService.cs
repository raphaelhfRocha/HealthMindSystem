using AutoMapper;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Application.Medicamentos.Commands;
using HealthMindBackend.Application.Prontuarios.Commands;
using HealthMindBackend.Application.Prontuarios.Queries;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HealthMindBackend.Application.Medicamentos.Queries;

namespace HealthMindBackend.Application.Services
{
    public class ProntuarioService : IProntuarioService
    {
        private readonly IMapper _mapper;
        private readonly IMediator _mediator;
        private readonly ILogger<ProntuarioService> _logger;

        public ProntuarioService(IMapper mapper, IMediator mediator, ILogger<ProntuarioService> logger)
        {
            _mapper = mapper;
            _mediator = mediator;
            _logger = logger;
        }

        public async Task EditarMedicamento(String prontuarioId, String medicamentoId, MedicamentoDTO medicamentoDto)
        {
            var medicamentoUpdateCommand = _mapper.Map<MedicamentoUpdateCommand>(medicamentoDto);
            medicamentoUpdateCommand.ProntuarioId = prontuarioId;
            medicamentoUpdateCommand.Id = medicamentoId;
            await _mediator.Send(medicamentoUpdateCommand);
        }

        public async Task EditarProntuario(ProntuarioDTO prontuarioDto)
        {
            var prontuarioUpdateCommand = _mapper.Map<ProntuarioUpdateCommand>(prontuarioDto);
            await _mediator.Send(prontuarioUpdateCommand);
        }

        public async Task ExcluirMedicamento(String prontuarioId, String medicamentoId)
        {
            var medicamentoDeleteCommand = new MedicamentoDeleteCommand(medicamentoId, prontuarioId);
            await _mediator.Send(medicamentoDeleteCommand);

        }

        public async Task<IEnumerable<ProntuarioDTO>> GetAllProntuarios()
        {
            var getAllProntuariosQuery = new GetAllProntuariosQuery();
            var result = await _mediator.Send(getAllProntuariosQuery);
            return _mapper.Map<IEnumerable<ProntuarioDTO>>(result);
        }

        public async Task<MedicamentoDTO> GetMedicamentoByProntuarioIdAndMedicamentoId(String prontuarioId, String medicamentoId)
        {
            var getMedicamentoByProntuarioIdAndMedicamentoIdQuery = new GetMedicamentoByProntuarioIdAndMedicamentoIdQuery(prontuarioId, medicamentoId);
            var result = await _mediator.Send(getMedicamentoByProntuarioIdAndMedicamentoIdQuery);
            return _mapper.Map<MedicamentoDTO>(result);
        }

        public async Task<List<MedicamentoDTO>> GetMedicamentosByProntuarioId(String prontuarioId)
        {
            var getMedicamentosByProntuarioId = new GetMedicamentosByProntuarioIdQuery(prontuarioId);
            var result = await _mediator.Send(getMedicamentosByProntuarioId);
            return _mapper.Map<List<MedicamentoDTO>>(result);
        }

        public async Task RegistrarMedicamento(MedicamentoDTO medicamentoDto)
        {
            var medicamentoCreateCommand = _mapper.Map<MedicamentoCreateCommand>(medicamentoDto);
            await _mediator.Send(medicamentoCreateCommand);
        }

        public async Task RegistrarProntuario(ProntuarioDTO prontuarioDto)
        {
            var prontuarioCreateCommand = _mapper.Map<ProntuarioCreateCommand>(prontuarioDto);
            await _mediator.Send(prontuarioCreateCommand);
        }
    }
}
