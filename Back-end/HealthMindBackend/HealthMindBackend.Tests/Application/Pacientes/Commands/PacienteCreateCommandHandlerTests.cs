using FluentAssertions;
using FluentValidation;
using HealthMindBackend.Application.Pacientes.Commands;
using HealthMindBackend.Application.Pacientes.Handlers;
using HealthMindBackend.Application.Validators.Pacientes;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.ValueObjects.Contato;
using HealthMindBackend.Domain.ValueObjects.Documento.CpfCnpj;
using Moq;
using System.Formats.Asn1;
using System.Runtime.ConstrainedExecution;
using System.Security.Cryptography.Xml;

namespace HealthMindBackend.Tests.Application.Pacientes.Commands
{
    public class PacienteCreateCommandHandlerTests
    {
        private readonly Mock<IPacienteRepository> _repositoryMock;
        private readonly PacienteCreateCommandHandler _handler;

        public PacienteCreateCommandHandlerTests()
        {
            _repositoryMock = new Mock<IPacienteRepository>();
            //_handler = new PacienteCreateCommandHandler(_repositoryMock.Object);
        }

        [Fact]
        public async Task Handle_DadosValidos_DeveCadastrarERetornarPaciente()
        {
            // Arrange
            var command = new PacienteCreateCommand
            {
                Nome = "Lucas Ferreira Santos",
                Email = new Email("lucas.ferreira@gmail.com"),
                CpfCnpj = new CpfCnpj("63545678901"),
                Telefone = new Telefone("1126939129"),
                DataNascimento = new DateTime(1998, 3, 15),
                PsicologoId = "PSI-004"
            };

            var pacienteEsperado = new Paciente(
                command.Nome,
                command.Email,
                command.CpfCnpj,
                command.Telefone,
                command.PsicologoId,
                command.DataNascimento,
                command.PlanoSaudePaciente);

            _repositoryMock
                .Setup(p => p.CadastrarPaciente(It.IsAny<Paciente>()))
                .ReturnsAsync(pacienteEsperado);

            // Act
            var result = await _handler.Handle(command, CancellationToken.None);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeSameAs(pacienteEsperado);
            _repositoryMock.Verify(
                p => p.CadastrarPaciente(It.Is<Paciente>(paciente =>
                    paciente.Nome == command.Nome &&
                    paciente.Email == command.Email &&
                    paciente.CpfCnpj == command.CpfCnpj &&
                    paciente.Telefone == command.Telefone &&
                    paciente.PsicologoId == command.PsicologoId &&
                    paciente.DataNascimento == command.DataNascimento)),
                Times.Once);
        }

        //[Fact]
        //public async Task Handle_QuandoRepositorioFalhar_DevePropagarExcecao()
        //{
        //    // Arrange
        //    var command = new PacienteCreateCommand
        //    {
        //        Nome = "Lucas Ferreira Santos",
        //        Email = "lucas.ferreira@gmail.com",
        //        CpfCnpj = "63545678901",
        //        DataNascimento = new DateTime(1998, 3, 15),
        //        PsicologoId = "PSI-004"
        //    };

        //    _repositoryMock
        //        .Setup(p => p.CadastrarPaciente(It.IsAny<Paciente>()))
        //        .ThrowsAsync(new InvalidOperationException("Falha ao salvar paciente"));

        //    // Act
        //    var act = () => _handler.Handle(command, CancellationToken.None);

        //    // Assert
        //    await act.Should().ThrowAsync<InvalidOperationException>()
        //        .WithMessage("Falha ao salvar paciente");
        //}

        //[Fact]
        //public async Task Handle_NomeVazio_LancarExcecao()
        //{
        //    var command = new PacienteCreateCommand
        //    {
        //        Nome = "",
        //        Email = "raphael@gmail.com",
        //        CpfCnpj = "50208129863",
        //        DataNascimento = new DateTime(1999, 10, 05),
        //        PsicologoId = "PSI-031"
        //    };

        //    var pacienteRepoMock = new Mock<IPacienteRepository>();
        //    var psicologoRepoMock = new Mock<IPsicologoRepository>();
        //    psicologoRepoMock
        //        .Setup(p => p.GetPsicologoById("PSI-031"))
        //        .ReturnsAsync(new Psicologo());


        //    var validator = new PacienteCreateCommandValidator(
        //        pacienteRepoMock.Object,
        //        psicologoRepoMock.Object
        //    );

        //    var result = validator.Validate(command);

        //    result.IsValid.Should().BeFalse();
        //    result.Errors.Should().Contain(p => p.PropertyName == "Nome" 
        //    && p.ErrorMessage.Contains("Nome Paciente Obrigat�rio"));
        //}

        //[Fact]
        //public async Task Handle_NomeMenosOitoCaracteres_LancarExcecao()
        //{
        //    var command = new PacienteCreateCommand
        //    {
        //        Nome = "Raphael",
        //        Email = "raphael@gmail.com",
        //        CpfCnpj = "50208129863",
        //        DataNascimento = new DateTime(1999, 10, 05),
        //        PsicologoId = "PSI-031"
        //    };

        //    var pacienteRepoMock = new Mock<IPacienteRepository>();
        //    var psicologoRepoMock = new Mock<IPsicologoRepository>();
        //    psicologoRepoMock
        //        .Setup(p => p.GetPsicologoById("PSI-031"))
        //        .ReturnsAsync(new Psicologo());

        //    var validator = new PacienteCreateCommandValidator(
        //        pacienteRepoMock.Object,
        //        psicologoRepoMock.Object
        //    );

        //    var result = validator.Validate(command);

        //    result.IsValid.Should().BeFalse();
        //    result.Errors.Should().Contain(p => p.PropertyName == "Nome" 
        //    && p.ErrorMessage.Contains("Nome Paciente deve ter no m�nimo 8 caracteres"));
        //}

        //[Fact]
        //public async Task Handle_NomeComMaisCentoEVinteCaracteres_LancarExcecao()
        //{
        //    var command = new PacienteCreateCommand
        //    {
        //        Nome = "raaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaphaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeellllllllllllllllllllllllllllllllllllll",
        //        Email = "raphaelrochaacft@gmail.com",
        //        CpfCnpj = "50208120863",
        //        DataNascimento = new DateTime(1999, 10, 05),
        //        PsicologoId = "PSI-031"
        //    };

        //    var pacienteRepoMock = new Mock<IPacienteRepository>();
        //    var psicologoRepoMock = new Mock<IPsicologoRepository>();
        //    psicologoRepoMock
        //        .Setup(p => p.GetPsicologoById("PSI-031"))
        //        .ReturnsAsync(new Psicologo());

        //    var validator = new PacienteCreateCommandValidator(
        //        pacienteRepoMock.Object,
        //        psicologoRepoMock.Object
        //    );

        //    var result = validator.Validate(command);

        //    result.IsValid.Should().BeFalse();
        //    result.Errors.Should().Contain(p => p.PropertyName == "Nome" 
        //    && p.ErrorMessage.Contains("Nome Paciente deve ter no m�ximo 120 caracteres"));
        //}

        //[Fact]
        //public async Task Handle_EmailVazio_LancarExcecao()
        //{
        //    var command = new PacienteCreateCommand
        //    {
        //        Nome = "Raphael Henrique",
        //        Email = "",
        //        CpfCnpj = "50208129863",
        //        DataNascimento = new DateTime(1999, 10, 05),
        //        PsicologoId = "PSI-031"
        //    };

        //    var pacienteRepoMock = new Mock<IPacienteRepository>();
        //    var psicologoRepoMock = new Mock<IPsicologoRepository>();
        //    psicologoRepoMock
        //        .Setup(p => p.GetPsicologoById("PSI-031"))
        //        .ReturnsAsync(new Psicologo());

        //    var validator = new PacienteCreateCommandValidator(
        //        pacienteRepoMock.Object,
        //        psicologoRepoMock.Object
        //    );

        //    var result = validator.Validate(command);

        //    result.IsValid.Should().BeFalse();
        //    result.Errors.Should().Contain(p => p.PropertyName == "Email" 
        //    && p.ErrorMessage.Contains("E-mail Paciente Obrigat�rio"));
        //}

        //[Fact]
        //public async Task Handle_EmailFormatoInvalido_LancarExcecao()
        //{
        //    var command = new PacienteCreateCommand
        //    {
        //        Nome = "Raphael Henrique",
        //        Email = "raphaelrochaacft.com",
        //        CpfCnpj = "50208129863",
        //        DataNascimento = new DateTime(1999, 10, 05),
        //        PsicologoId = "PSI-031"
        //    };

        //    var pacienteRepoMock = new Mock<IPacienteRepository>();
        //    var psicologoRepoMock = new Mock<IPsicologoRepository>();
        //    psicologoRepoMock
        //        .Setup(p => p.GetPsicologoById("PSI-031"))
        //        .ReturnsAsync(new Psicologo());

        //    var validator = new PacienteCreateCommandValidator(
        //        pacienteRepoMock.Object,
        //        psicologoRepoMock.Object
        //    );

        //    var result = validator.Validate(command);
        //    result.IsValid.Should().BeFalse();
        //    result.Errors.Should().Contain(p => p.PropertyName == "Email" 
        //    && p.ErrorMessage.Contains("E-mail Inv�lido"));
        //}

        //[Fact]
        //public async Task Handle_EmailJaCadastrado_LancarExcecao()
        //{
        //    var command = new PacienteCreateCommand
        //    {
        //        Nome = "Raphael Henrique",
        //        Email = "lucas.almeida@email.com",
        //        CpfCnpj = "50208129863",
        //        DataNascimento = new DateTime(1999, 10, 05),
        //        PsicologoId = "PSI-031"
        //    };

        //    var pacienteRepoMock = new Mock<IPacienteRepository>();
        //    pacienteRepoMock
        //        .Setup(p => p.GetPacienteByEmail("lucas.almeida@email.com"))
        //        .ReturnsAsync(new Paciente());
        //    var psicologoRepoMock = new Mock<IPsicologoRepository>();
        //    psicologoRepoMock
        //        .Setup(p => p.GetPsicologoById("PSI-031"))
        //        .ReturnsAsync(new Psicologo());

        //    var validator = new PacienteCreateCommandValidator(
        //        pacienteRepoMock.Object,
        //        psicologoRepoMock.Object
        //    );

        //    var result = validator.Validate(command);
        //    result.IsValid.Should().BeFalse();
        //    result.Errors.Should().Contain(p => p.PropertyName == "Email" 
        //    && p.ErrorMessage.Contains("E-mail J� Cadastrado"));
        //}

        //[Fact]
        //public async Task Handle_DataNascimentoMinValue_LancarExcecao()
        //{
        //    var command = new PacienteCreateCommand
        //    {
        //        Nome = "Raphael Henrique",
        //        Email = "raphaelrochaacft@gmail.com",
        //        CpfCnpj = "50208129863",
        //        DataNascimento = DateTime.MinValue,
        //        PsicologoId = "PSI-031"
        //    };

        //    var pacienteRepoMock = new Mock<IPacienteRepository>();
        //    var psicologoRepoMock = new Mock<IPsicologoRepository>();
        //    psicologoRepoMock
        //        .Setup(p => p.GetPsicologoById("PSI-031"))
        //        .ReturnsAsync(new Psicologo());

        //    var validator = new PacienteCreateCommandValidator(
        //        pacienteRepoMock.Object,
        //        psicologoRepoMock.Object
        //    );

        //    var result = validator.Validate(command);
        //    result.IsValid.Should().BeFalse();
        //    result.Errors.Should().Contain(p => p.PropertyName == "DataNascimento" 
        //    && p.ErrorMessage.Contains("Data Nascimento Obrigat�ria"));
        //}
        //[Fact]
        //public async Task Handle_CpfCnpjVazio_LancarExcecao()
        //{
        //    var command = new PacienteCreateCommand
        //    {
        //        Nome = "Raphael Henrique",
        //        Email = "raphaelrochaacft@gmail.com",
        //        CpfCnpj = "",
        //        DataNascimento = new DateTime(1999, 10, 05),
        //        PsicologoId = "PSI-031"
        //    };

        //    var pacienteRepoMock = new Mock<IPacienteRepository>();
        //    var psicologoRepoMock = new Mock<IPsicologoRepository>();
        //    psicologoRepoMock
        //        .Setup(p => p.GetPsicologoById("PSI-031"))
        //        .ReturnsAsync(new Psicologo());

        //    var validator = new PacienteCreateCommandValidator(
        //        pacienteRepoMock.Object,
        //        psicologoRepoMock.Object
        //    );

        //    var result = validator.Validate(command);
        //    result.IsValid.Should().BeFalse();
        //    result.Errors.Should().Contain(p => p.PropertyName == "CpfCnpj" 
        //    && p.ErrorMessage.Contains("CPF/CNPJ paciente obrigat�rio"));
        //}

        //[Fact]
        //public async Task Handle_CpfCnpjMenosDe11Caracteres_LancarExcecao()
        //{
        //    var command = new PacienteCreateCommand
        //    {
        //        Nome = "Raphael Henrique",
        //        Email = "raphaelrochaacft@gmail.com",
        //        CpfCnpj = "502081",
        //        DataNascimento = new DateTime(1999, 10, 05),
        //        PsicologoId = "PSI-031"
        //    };

        //    var pacienteRepoMock = new Mock<IPacienteRepository>();
        //    var psicologRepoMock = new Mock<IPsicologoRepository>();
        //    psicologRepoMock
        //        .Setup(p => p.GetPsicologoById("PSI-031"))
        //        .ReturnsAsync(new Psicologo());

        //    var validator = new PacienteCreateCommandValidator(
        //        pacienteRepoMock.Object,
        //        psicologRepoMock.Object
        //    );

        //    var result = validator.Validate(command);
        //    result.IsValid.Should().BeFalse();
        //    result.Errors.Should().Contain(p => p.PropertyName == "CpfCnpj" 
        //    && p.ErrorMessage.Contains("CPF/CNPJ deve ter no m�nimo 11 caracteres"));
        //}

        //[Fact]
        //public async Task Handle_CpfCnpjMaisDeQuatorzeCaracteres_LancarExcecao()
        //{
        //    var command = new PacienteCreateCommand
        //    {
        //        Nome = "Raphael Henrique",
        //        Email = "raphaelrochaacft@gmail.com",
        //        CpfCnpj = "502081298630000000",
        //        DataNascimento = new DateTime(1999, 10, 05),
        //        PsicologoId = "PSI-031"
        //    };

        //    var pacienteRepoMock = new Mock<IPacienteRepository>();
        //    var psicologoRepoMock = new Mock<IPsicologoRepository>();
        //    psicologoRepoMock
        //        .Setup(p => p.GetPsicologoById("PSI-031"))
        //        .ReturnsAsync(new Psicologo());

        //    var validator = new PacienteCreateCommandValidator(
        //        pacienteRepoMock.Object,
        //        psicologoRepoMock.Object
        //    );

        //    var result = validator.Validate(command);
        //    result.IsValid.Should().BeFalse();
        //    result.Errors.Should().Contain(p => p.PropertyName == "CpfCnpj" 
        //    && p.ErrorMessage.Contains("CPF/CNPJ deve ter no m�ximo 14 caracteres"));
        //}

        //[Fact]
        //public async Task Handle_CpfCnpjJaCadastrado_LancarExcecao()
        //{
        //    var command = new PacienteCreateCommand
        //    {
        //        Nome = "Raphael Henrique",
        //        Email = "raphaelrochaacft@gmail.com",
        //        CpfCnpj = "45678912345",
        //        DataNascimento = new DateTime(1999, 10, 05),
        //        PsicologoId = "PSI-031"
        //    };

        //    var pacienteRepoMock = new Mock<IPacienteRepository>();
        //    pacienteRepoMock
        //        .Setup(p => p.GetPacienteByCpfCnpj("45678912345"))
        //        .ReturnsAsync(new Paciente());
        //    var psicologoRepoMock = new Mock<IPsicologoRepository>();
        //    psicologoRepoMock
        //        .Setup(p => p.GetPsicologoById("PSI_031"))
        //        .ReturnsAsync(new Psicologo());

        //    var validator = new PacienteCreateCommandValidator(
        //        pacienteRepoMock.Object,
        //        psicologoRepoMock.Object
        //    );

        //    var result = validator.Validate(command);
        //    result.IsValid.Should().BeFalse();
        //    result.Errors.Should().Contain(p => p.PropertyName == "CpfCnpj" 
        //    && p.ErrorMessage.Contains("CPF/CNPJ j� cadastrado no sistema"));        
        //}

        //[Fact]
        //public async Task Handle_IdPsicologoVazio_LancarExcecao()
        //{
        //    var command = new PacienteCreateCommand
        //    {
        //        Nome = "Raphael Henrique",
        //        Email = "raphaelrochaacft@gmail.com",
        //        CpfCnpj = "50208129863",
        //        DataNascimento = new DateTime(1999, 10, 05),
        //        PsicologoId = ""
        //    };

        //    var pacienteRepoMock = new Mock<IPacienteRepository>();
        //    var psicologoRepoMock = new Mock<IPsicologoRepository>();
        //    psicologoRepoMock
        //        .Setup(p => p.GetPsicologoById(command.PsicologoId))
        //        .ReturnsAsync(new Psicologo());

        //    var validator = new PacienteCreateCommandValidator(
        //        pacienteRepoMock.Object,
        //        psicologoRepoMock.Object
        //    );

        //    var result = validator.Validate(command);
        //    result.IsValid.Should().BeFalse();
        //    result.Errors.Should().Contain(p => p.PropertyName == "PsicologoId" 
        //    && p.ErrorMessage.Contains("Psic�logo respons�vel deve ser atribu�do"));
        //}

        //[Fact]
        //public async Task Handle_PsicologoNaoExiste_LancarExcecao()
        //{
        //    var command = new PacienteCreateCommand
        //    {
        //        Nome = "Raphael Henrique",
        //        Email = "raphaelrochaacft@gmail.com",
        //        CpfCnpj = "50208129863",
        //        DataNascimento = new DateTime(1999, 10, 05),
        //        PsicologoId = "PRT-001"
        //    };

        //    var pacienteRepoMock = new Mock<IPacienteRepository>();
        //    var psicologoRepoMock = new Mock<IPsicologoRepository>();
        //    psicologoRepoMock
        //        .Setup(p => p.GetPsicologoById(command.PsicologoId))
        //        .ReturnsAsync((Psicologo?)null);

        //    var validator = new PacienteCreateCommandValidator(
        //        pacienteRepoMock.Object,
        //        psicologoRepoMock.Object
        //    );

        //    var result = validator.Validate(command);
        //    result.IsValid.Should().BeFalse();
        //    result.Errors.Should().Contain(p => p.PropertyName == "PsicologoId" 
        //    && p.ErrorMessage.Contains("Psicologo selecionado n�o est� ativo"));
        //}
    }
}
