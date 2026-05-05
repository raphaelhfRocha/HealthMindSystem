using AutoMapper;
using HealthMindBackend.Application.Diagnosticos.Commands;
using HealthMindBackend.Application.Diagnosticos.Queries;
using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Services
{
    public class DiagnosticoService : IDiagnosticoService
    {
        private readonly IMapper _mapper;
        private readonly IMediator _mediator;

        public DiagnosticoService(IMapper mapper, IMediator mediator)
        {
            _mapper = mapper;
            _mediator = mediator;
        }

        public async Task AdicionarDiagnostico(DiagnosticoDTO diagnosticoDto)
        {
            var createDiagnostico = _mapper.Map<DiagnosticoCreateCommand>(diagnosticoDto);
            await _mediator.Send(createDiagnostico);
        }

        public async Task AtualizarDiagnostico(DiagnosticoDTO diagnosticoDto)
        {
            var diagnosticoUpdateCommand = _mapper.Map<DiagnosticoUpdateCommand>(diagnosticoDto);
            await _mediator.Send(diagnosticoUpdateCommand);
        }

        public async Task<IEnumerable<DiagnosticoDTO>> GetAllDiagnosticos()
        {
            var diagnosticosQuery = new GetAllDiagnosticosQuery();
            var result = await _mediator.Send(diagnosticosQuery);
            return _mapper.Map<IEnumerable<DiagnosticoDTO>>(result);
        }
    }
}
