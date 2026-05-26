using FluentAssertions;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.Validations;
using HealthMindBackend.Domain.ValueObjects.Contato;
using HealthMindBackend.Domain.ValueObjects.Documento;
using HealthMindBackend.Domain.ValueObjects.Documento.CpfCnpj;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Tests.Domain.Entities
{
    public class PsicologoTests
    {
        [Fact]
        public void RegistrarPsicologo_DadosPreenchidos_DeveSerValido()
        {
            var psicologo = new Psicologo(
                "João Gabriel",
                new Email("joao@healthmind.com"),
                "",
                StatusCargoEnum.StsPsicologo,
                StatusRoleEnum.StsAdmin,
                new CpfCnpj("23488497000134"),
                new Crp("06123456"),
                "Teste"
                );


            psicologo.Should().NotBeNull();
        }

        [Fact]
        public void RegistrarPsicologo_DadosVazios_DeveLancarExcecao()
        {
            Action action = () => new Psicologo(
                "",
                new Email(""),
                "",
                StatusCargoEnum.StsNone,
                StatusRoleEnum.StsNone,
                new CpfCnpj(""),
                new Crp(""),
                ""
                );

            action.Should().Throw<DomainExceptionValidation>();
        }

        [Fact]
        public void RegistrarPsicologo_NomeVazio_DeveLancarExcecao()
        {
            Action action = () => new Psicologo(
                "",
                new Email("joao@healthmind.com"),
                "",
                StatusCargoEnum.StsPsicologo,
                StatusRoleEnum.StsAdmin,
                new CpfCnpj("23488497000134"),
                new Crp("06123456"),
                "Teste"
                );

            action.Should().Throw<DomainExceptionValidation>();
        }

        [Fact]
        public void RegistrarPsicologo_NomeMenosOitoCaracteres_DeveLancarExcecao()
        {
            Action action = () => new Psicologo(
                "João",
                new Email("joao@healthmind.com"),
                "",
                StatusCargoEnum.StsPsicologo,
                StatusRoleEnum.StsAdmin,
                new CpfCnpj("23488497000134"),
                new Crp("06123456"),
                "Teste"
                );

            action.Should().Throw<DomainExceptionValidation>();
        }

        [Fact]
        public void RegistrarPsicologo_NomeMaisCentroEVinteCaracteres_DeveLancarExcecao()
        {
            Action action = () => new Psicologo(
                "Jooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaooooooooooooooooooooooooooooooooooooooooooooooooooooo",
                new Email("joao@healthmind.com"),
                "",
                StatusCargoEnum.StsPsicologo,
                StatusRoleEnum.StsAdmin,
                new CpfCnpj("23488497000134"),
                new Crp("06123456"),
                "Teste"
                );

            action.Should().Throw<DomainExceptionValidation>();
        }

        [Fact]
        public void RegistrarPsicologo_EmailVazio_DeveLancarExcecao()
        {
            Action action = () => new Psicologo(
                "João Gabriel",
                new Email(""),
                "",
                StatusCargoEnum.StsPsicologo,
                StatusRoleEnum.StsAdmin,
                new CpfCnpj("23488497000134"),
                new Crp("06123456"),
                "Teste"
                );

            action.Should().Throw<DomainExceptionValidation>();
        }

        [Fact]
        public void RegistrarPsicologo_StatusCargoEnumStsNone_DeveLancarExcecao()
        {
            Action action = () => new Psicologo(
                "João Gabriel",
                new Email(""),
                "",
                StatusCargoEnum.StsNone,
                StatusRoleEnum.StsAdmin,
                new CpfCnpj("23488497000134"),
                new Crp("06123456"),
                "Teste"
                );

            action.Should().Throw<DomainExceptionValidation>();
        }

        [Fact]
        public void RegistrarPsicologo_StatusCargoEnumStsRecepcionista_DeveLancarExcecao()
        {
            Action action = () => new Psicologo(
                "João Gabriel",
                new Email(""),
                "",
                StatusCargoEnum.StsRecepcionista,
                StatusRoleEnum.StsAdmin,
                new CpfCnpj("23488497000134"),
                new Crp("06123456"),
                "Teste"
                );

            action.Should().Throw<DomainExceptionValidation>();
        }

        [Fact]
        public void RegistrarPsicologo_StatusRoleEnumStsNone_DeveLancarExcecao()
        {
            Action action = () => new Psicologo(
                "João Gabriel",
                new Email(""),
                "",
                StatusCargoEnum.StsPsicologo,
                StatusRoleEnum.StsNone,
                new CpfCnpj("23488497000134"),
                new Crp("06123456"),
                "Teste"
                );

            action.Should().Throw<DomainExceptionValidation>();
        }
    }
}
