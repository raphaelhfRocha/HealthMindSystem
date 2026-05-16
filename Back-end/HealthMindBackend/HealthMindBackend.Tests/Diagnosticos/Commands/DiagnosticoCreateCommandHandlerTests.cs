using HealthMindBackend.Application.Diagnosticos.Handlers;
using HealthMindBackend.Domain.Interfaces;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Tests.Diagnosticos.Commands
{
    public class DiagnosticoCreateCommandHandlerTests
    {
        private readonly Mock<IDiagnosticoRepository> _repositoryMock;
        private readonly DiagnosticoCreateCommandHandler _handler;

        public DiagnosticoCreateCommandHandlerTests()
        {
            _repositoryMock = new Mock<IDiagnosticoRepository>();
            _handler = new DiagnosticoCreateCommandHandler(_repositoryMock.Object);
        }
    }
}
