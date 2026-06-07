using AutoMapper;
using HealthMindBackend.Application.CoberturasPlanos.Commands;
using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Application.PlanosSaude.Commands;
using HealthMindBackend.Application.PlanosSaude.Queries;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Services
{
    public class PlanoSaudeService : IPlanoSaudeService
    {
        private readonly IMapper _mapper;
        private readonly IMediator _mediator;

        public PlanoSaudeService(IMapper mapper, IMediator mediator)
        {
            _mapper = mapper;
            _mediator = mediator;
        }

        public async Task AtualizarCoberturaPlano(String planoSaudeId, CoberturaPlanoDTO coberturaPlanoDto)
        {
            var coberturaPlanoUpdateCommand = _mapper.Map<CoberturaPlanoUpdateCommand>(coberturaPlanoDto);
            coberturaPlanoUpdateCommand.PlanoSaudeId = planoSaudeId;
            await _mediator.Send(coberturaPlanoUpdateCommand);
        }

        public async Task AtualizarPlanoSaude(PlanoSaudeDTO planoSaudeDto)
        {
            var planoSaudeUpdateCommand = _mapper.Map<PlanoSaudeUpdateCommand>(planoSaudeDto);
            await _mediator.Send(planoSaudeUpdateCommand);
        }

        public async Task<IEnumerable<PlanoSaudeDTO>> GetAllPlanosSaude()
        {
            var getAllPlanosSaude = new GetAllPlanosSaudeQuery();
            var result = await _mediator.Send(getAllPlanosSaude);
            return _mapper.Map<IEnumerable<PlanoSaudeDTO>>(result);
        }

        public async Task RegistrarCoberturaPlano(String planoSaudeId, CoberturaPlanoDTO coberturaPlanoDto)
        {
            var coberturaPlanoCreateCommand = _mapper.Map<CoberturaPlanoCreateCommand>(coberturaPlanoDto);
            coberturaPlanoCreateCommand.PlanoSaudeId = planoSaudeId;
            await _mediator.Send(coberturaPlanoCreateCommand);
        }

        public async Task RegistrarPlanoSaude(PlanoSaudeDTO planoSaudeDto)
        {
            var planoSaudeCreateCommand = _mapper.Map<PlanoSaudeCreateCommand>(planoSaudeDto);
            await _mediator.Send(planoSaudeCreateCommand);
        }

        public async Task RemoverCoberturaPlano(String planoSaudeId, String especialidade)
        {
            var coberturaPlanoDeleteCommand = new CoberturaPlanoDeleteCommand(planoSaudeId, especialidade);
            await _mediator.Send(coberturaPlanoDeleteCommand);
        }
    }
}
