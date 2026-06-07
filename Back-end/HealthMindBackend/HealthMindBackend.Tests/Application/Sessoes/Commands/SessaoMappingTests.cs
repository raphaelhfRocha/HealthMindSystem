using AutoMapper;
using FluentAssertions;
using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Mappings;
using HealthMindBackend.Application.Pagamentos.Commands;
using HealthMindBackend.Application.Sessoes.Commands;
using HealthMindBackend.Domain.Enums;
using Microsoft.Extensions.Logging.Abstractions;

namespace HealthMindBackend.Tests.Application.Sessoes.Commands
{
    public class SessaoMappingTests
    {
        private readonly IMapper _mapper;

        public SessaoMappingTests()
        {
            var configuration = new MapperConfiguration(
                cfg => cfg.AddProfile<DTOToCommandsMappingsProfile>(),
                NullLoggerFactory.Instance);

            _mapper = configuration.CreateMapper();
        }

        [Fact]
        public void MapSessaoDtoParaSessaoUpdateCommand_ComPagamento_DeveMapearPagamentoConcreto()
        {
            var sessaoDto = new SessaoDTO
            {
                Id = "SES-1",
                PacienteId = "PAC-1",
                PsicologoId = "PSI-1",
                DataSessao = new DateTime(2026, 6, 2),
                HoraInicio = new TimeSpan(14, 0, 0),
                StatusTipoAtendimento = StatusTipoAtendimentoEnum.StsOnline,
                //StatusSessao = StatusSessaoEnum.StsPendente,
                PagamentoDTO = new PagamentoDTO
                {
                    SessaoId = "SES-1",
                    ValorCoberturaPlano = 50,
                    ValorConsultaFinal = 150,
                    DataPagamento = new DateTime(2026, 6, 2),
                    StatusFormaPagamento = StatusFormaPagamentoEnum.StsPix,
                    StatusPagamento = StatusPagamentoEnum.StsPendente,
                    StatusParcelado = StatusParceladoEnum.StsNao,
                    TotalParcelas = 0
                }
            };

            var command = _mapper.Map<SessaoUpdateCommand>(sessaoDto);

            command.PagamentoCommand.Should().BeOfType<PagamentoUpdateCommand>();
            command.PagamentoCommand.ValorConsultaFinal.Should().Be(sessaoDto.PagamentoDTO.ValorConsultaFinal);
        }
    }
}
