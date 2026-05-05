using AutoMapper;
using HealthMindBackend.Application.Interfaces;
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
    }
}
