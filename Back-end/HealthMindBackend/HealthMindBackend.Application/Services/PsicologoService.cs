using AutoMapper;
using FluentValidation;
using HealthMindBackend.Application.Disponibilidades.Commands;
using HealthMindBackend.Application.Disponibilidades.Queries;
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

        public async Task AdicionarDisponibilidade(DisponibilidadeDTO disponibilidadeDto)
        {
            var disponibilidadeCreateCommand = _mapper.Map<DisponibilidadeCreateCommand>(disponibilidadeDto);
            await _mediator.Send(disponibilidadeCreateCommand);
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

        public async Task ExcluirDisponibilidade(String psicologoId, String disponibilidadeId)
        {
            var disponibilidadeDeleteCommand = new DisponibilidadeDeleteCommand(disponibilidadeId, psicologoId);
            await _mediator.Send(disponibilidadeDeleteCommand);
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

        public async Task<List<DisponibilidadeDTO>> GetDisponibilidadesByPsicologoId(String psicologoId)
        {
            var getDisponibilidadesByPsicologoIdQuery = new GetDisponibilidadesByPsicologoIdQuery(psicologoId);
            var result = await _mediator.Send(getDisponibilidadesByPsicologoIdQuery);
            return _mapper.Map<List<DisponibilidadeDTO>>(result);
        }
 
        public async Task<List<PsicologoDTO>> GetPsicologosByNome(String nome)
        {
            var getPsicologoByNomeQuery = new GetPsicologosByNomeQuery(nome);
            var result = await _mediator.Send(getPsicologoByNomeQuery);
            return _mapper.Map<List<PsicologoDTO>>(result);
        }

        public async Task<List<PsicologoDTO>> GetPsicologosByEspecialidade(String especialidade)
        {
            var getPsicologosByEspecialidadeQuery = new GetPsicologosByEspecialidadeQuery(especialidade);
            var result = await _mediator.Send(getPsicologosByEspecialidadeQuery);
            return _mapper.Map<List<PsicologoDTO>>(result);
        }

        public async Task<PsicologoDTO> GetPsicologoById(String psicologoId)
        {
            var getPsicologoByIdQuery = new GetPsicologoByIdQuery(psicologoId);
            var result = await _mediator.Send(getPsicologoByIdQuery);
            return _mapper.Map<PsicologoDTO>(result);
        }
    }
}
