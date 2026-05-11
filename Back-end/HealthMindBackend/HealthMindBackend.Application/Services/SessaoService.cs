using AutoMapper;
using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Application.Pagamentos.Commands;
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

        public async Task<SessaoDTO> AgendarSessao(SessaoDTO sessaoDto)
        {
            var sessaoCreateCommand = _mapper.Map<SessaoCreateCommand>(sessaoDto);
            var result = await _mediator.Send(sessaoCreateCommand);
            return _mapper.Map<SessaoDTO>(result);
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

        public async Task ExcluirPagamento(String sessaoId)
        {
            var pagamentoDeleteCommand = new PagamentoDeleteCommand(sessaoId);
            await _mediator.Send(pagamentoDeleteCommand);
        }

        public async Task<IEnumerable<SessaoDTO>> GetAllSessoes()
        {
            var getAllsessoes = new GetAllSessoesQuery();
            var result = await _mediator.Send(getAllsessoes);
            return _mapper.Map<IEnumerable<SessaoDTO>>(result);
        }

        public async Task<SessaoDTO> GetSessaoById(String sessaoId)
        {
            var getSessaoByIdQuery = new GetSessaoByIdQuery(sessaoId);
            var result = await _mediator.Send(getSessaoByIdQuery);
            return _mapper.Map<SessaoDTO>(result);
        }

        public async Task<List<SessaoDTO>> GetSessoesByPsicologoId(String psicologoId)
        {
            var getSessoesByPsicologoIdQuery = new GetSessoesByPsicologoIdQuery(psicologoId);
            var result = await _mediator.Send(getSessoesByPsicologoIdQuery);
            return _mapper.Map<List<SessaoDTO>>(result);
        }
    }
}
