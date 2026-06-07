using HealthMindBackend.Application.Pacientes.Handlers;
using HealthMindBackend.Domain.Interfaces;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Tests.Application.Pacientes.Commands
{
    public class PacienteUpdateCommandHandlerTests
    {
        private readonly Mock<IPacienteRepository> _repositoryMock;
        private readonly PacienteUpdateCommandHandler _handler;

        public PacienteUpdateCommandHandlerTests()
        {
            _repositoryMock = new Mock<IPacienteRepository>();
            //_handler = new PacienteUpdateCommandHandler(_repositoryMock.Object);
        }
    }
}
