using AutoMapper;
using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.EscalasSessoes.Commands;
using HealthMindBackend.Application.EscalasSessoes.Queries;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Application.Pagamentos.Commands;
using HealthMindBackend.Application.RegistrosSessoes.Commands;
using HealthMindBackend.Application.RegistrosSessoes.Queries;
using HealthMindBackend.Application.Sessoes.Commands;
using HealthMindBackend.Application.Sessoes.Queries;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Services
{
    public class SessaoService : ISessaoService
    {
        private readonly IMapper _mapper;
        private readonly IMediator _mediator;

        public SessaoService(IMapper mapper, IMediator mediator)
        {
            _mapper = mapper;
            _mediator = mediator;
        }

        public async Task AdicionarEscalaSessao(EscalaSessaoDTO escalaSessaoDto)
        {
            var escalaSessaoCreateCommand = _mapper.Map<EscalaSessaoCreateCommand>(escalaSessaoDto);
            await _mediator.Send(escalaSessaoCreateCommand);
        }

        public async Task AdicionarRegistroSessao(RegistroSessaoDTO registroSessaoDto)
        {
            var registroSessaoCreateCommand = _mapper.Map<RegistroSessaoCreateCommand>(registroSessaoDto);
            await _mediator.Send(registroSessaoCreateCommand);
        }

        public async Task<SessaoDTO> AgendarSessao(SessaoDTO sessaoDto)
        {
            var sessaoCreateCommand = _mapper.Map<SessaoCreateCommand>(sessaoDto);
            var result = await _mediator.Send(sessaoCreateCommand);
            return _mapper.Map<SessaoDTO>(result);
        }

        public async Task AlterarEscalaSessao(EscalaSessaoDTO escalaSessaoDto)
        {
            var escalaSessaoUpdateCommand = _mapper.Map<EscalaSessaoUpdateCommand>(escalaSessaoDto);
            await _mediator.Send(escalaSessaoUpdateCommand);
        }

        public async Task AlterarRegistroSessao(RegistroSessaoDTO registroSessaoDto)
        {
            var registroSessaoUpdateCommand = _mapper.Map<RegistroSessaoUpdateCommand>(registroSessaoDto);
            await _mediator.Send(registroSessaoUpdateCommand);
        }

        public async Task AlterarSessao(SessaoDTO sessaoDto)
        {
            var sessaoUpdateCommand = _mapper.Map<SessaoUpdateCommand>(sessaoDto);
            await _mediator.Send(sessaoUpdateCommand);
        }

        public async Task DefinirPagamento(PagamentoDTO pagamentoDto)
        {
            var pagamentoUpdateCommand = _mapper.Map<PagamentoUpdateCommand>(pagamentoDto);
            await _mediator.Send(pagamentoUpdateCommand);
        }

        public async Task ExcluirEscalaSessao(String sessaoId, String escalaSessaoId)
        {
            var escalaSessaoDeleteCommand = new EscalaSessaoDeleteCommand(escalaSessaoId, sessaoId);
            await _mediator.Send(escalaSessaoDeleteCommand);
        }

        public async Task ExcluirRegistroSessao(String sessaoId, String registroSessaoId)
        {
            var registroSessaoDeleteCommand = new RegistroSessaoDeleteCommand(registroSessaoId, sessaoId);
            await _mediator.Send(registroSessaoDeleteCommand);
        }

        public async Task ExcluirSessao(String sessaoId)
        {
            var sessaoDeleteCommand = new SessaoDeleteCommand(sessaoId);
            await _mediator.Send(sessaoDeleteCommand);
        }

        public async Task<IEnumerable<SessaoDTO>> GetAllSessoes()
        {
            var getAllsessoes = new GetAllSessoesQuery();
            var result = await _mediator.Send(getAllsessoes);
            return _mapper.Map<IEnumerable<SessaoDTO>>(result);
        }

        public async Task<List<EscalaSessaoDTO>> GetEscalasSessoesBySessaoId(String sessaoId)
        {
            var getEscalasSessoesBySessaoIdQuery = new GetEscalasSessoesBySessaoIdQuery(sessaoId);
            var result = await _mediator.Send(getEscalasSessoesBySessaoIdQuery);
            return _mapper.Map<List<EscalaSessaoDTO>>(result);
        }

        public async Task<List<RegistroSessaoDTO>> GetRegistrosSessoesBySessaoId(String sessaoId)
        {
            var getRegistrosSessoesBySessaoIdQuery = new GetRegistrosSessoesBySessaoIdQuery(sessaoId);
            var result = await _mediator.Send(getRegistrosSessoesBySessaoIdQuery);
            return _mapper.Map<List<RegistroSessaoDTO>>(result);
        }

        public async Task<SessaoDTO> GetSessaoById(String sessaoId)
        {
            var getSessaoByIdQuery = new GetSessaoByIdQuery(sessaoId);
            var result = await _mediator.Send(getSessaoByIdQuery);
            return _mapper.Map<SessaoDTO>(result);
        }

        public async Task<List<SessaoDTO>> GetSessoesByPacienteId(String pacienteId)
        {
            var getSessoesByPacienteId = new GetSessoesByPacienteIdQuery(pacienteId);
            var result = await _mediator.Send(getSessoesByPacienteId);
            return _mapper.Map<List<SessaoDTO>>(result);
        }

        public async Task<List<SessaoDTO>> GetSessoesByPsicologoId(String psicologoId)
        {
            var getSessoesByPsicologoIdQuery = new GetSessoesByPsicologoIdQuery(psicologoId);
            var result = await _mediator.Send(getSessoesByPsicologoIdQuery);
            return _mapper.Map<List<SessaoDTO>>(result);
        }
    }
}
