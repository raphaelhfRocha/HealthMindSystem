using AutoMapper;
using HealthMindBackend.Application.CoberturasPlanos.Commands;
using HealthMindBackend.API.DTOs;
using HealthMindBackend.Application.Auths.Commands;
using HealthMindBackend.Application.Diagnosticos.Commands;
using HealthMindBackend.Application.Disponibilidades.Commands;
using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.EscalasSessoes.Commands;
using HealthMindBackend.Application.HistoricosMedicos.Commands;
using HealthMindBackend.Application.Medicamentos.Commands;
using HealthMindBackend.Application.MetasTerapeuticas.Commands;
using HealthMindBackend.Application.Pacientes.Commands;
using HealthMindBackend.Application.Pagamentos.Commands;
using HealthMindBackend.Application.PlanosSaude.Commands;
using HealthMindBackend.Application.Progressoes.Commands;
using HealthMindBackend.Application.Prontuarios.Commands;
using HealthMindBackend.Application.Psicologos.Commands;
using HealthMindBackend.Application.Recepcionistas.Commands;
using HealthMindBackend.Application.RegistrosSessoes.Commands;
using HealthMindBackend.Application.SaudesMentais.Commands;
using HealthMindBackend.Application.Sessoes.Commands;
using HealthMindBackend.Domain.ValueObjects.Agenda.Disponibilidade;
using HealthMindBackend.Domain.ValueObjects.Contato;
using HealthMindBackend.Domain.ValueObjects.Contato.ContatoEmergencia;
using HealthMindBackend.Domain.ValueObjects.Documento;
using HealthMindBackend.Domain.ValueObjects.Documento.CpfCnpj;
using HealthMindBackend.Domain.ValueObjects.Evolucao.MetasTerapeuticas;
using HealthMindBackend.Domain.ValueObjects.Financeiro.CoberturaPlano;
using HealthMindBackend.Domain.ValueObjects.Local;
using HealthMindBackend.Domain.ValueObjects.Saude;
using HealthMindBackend.Domain.ValueObjects.Saude.Medicamento;
using HealthMindBackend.Domain.ValueObjects.Sessao.EscalasSessao;
using HealthMindBackend.Domain.ValueObjects.Sessao.RegistroSessao;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Mappings
{
    public class DTOToCommandsMappingsProfile : Profile
    {
        public DTOToCommandsMappingsProfile()
        {
            CreateMap<PsicologoCadastroDTO, AuthPsicologoCreateCommand>();
            CreateMap<RecepcionistaCadastroDTO, AuthRecepcionistaCreateCommand>();
            CreateMap<PacienteDTO, PacienteCreateCommand>()
                .ForMember(
                    dest => dest.Email,
                    opt => opt.MapFrom(src => new Email(src.Email))
                )
                .ForMember(
                    dest => dest.CpfCnpj,
                    opt => opt.MapFrom(src => new CpfCnpj(src.CpfCnpj))
                )
                .ForMember(
                    dest => dest.Telefone,
                    opt => opt.MapFrom(src => new Telefone(src.Telefone))
                )
                .ForMember(
                    dest => dest.PlanoSaudePaciente,
                    opt => opt.MapFrom(src => src.PlanoSaudePacienteDTO)
                );
            CreateMap<PacienteDTO, PacienteUpdateCommand>()
                .ForMember(
                    dest => dest.Email,
                    opt => opt.MapFrom(src => new Email(src.Email))
                )
                .ForMember(
                    dest => dest.CpfCnpj,
                    opt => opt.MapFrom(src => new CpfCnpj(src.CpfCnpj))
                )
                .ForMember(
                    dest => dest.Telefone,
                    opt => opt.MapFrom(src => new Telefone(src.Telefone))
                )
                .ForMember(
                    dest => dest.PlanoSaudePaciente,
                    opt => opt.MapFrom(src => src.PlanoSaudePacienteDTO)
                );
            CreateMap<PsicologoDTO, PsicologoCreateCommand>()
                .ForMember(
                    dest => dest.Email,
                    opt => opt.MapFrom(src => new Email(src.Email))
                )
                .ForMember(
                    dest => dest.CpfCnpj,
                    opt => opt.MapFrom(src => new CpfCnpj(src.CpfCnpj))
                )
                .ForMember(
                    dest => dest.Crp,
                    opt => opt.MapFrom(src => new Crp(src.Crp))
                );
            CreateMap<PsicologoDTO, PsicologoUpdateCommand>()
                .ForMember(
                    dest => dest.Email,
                    opt => opt.MapFrom(src => new Email(src.Email))
                )
                .ForMember(
                    dest => dest.CpfCnpj,
                    opt => opt.MapFrom(src => new CpfCnpj(src.CpfCnpj))
                )
                .ForMember(
                    dest => dest.Crp,
                    opt => opt.MapFrom(src => new Crp(src.Crp))
                )
                .ForMember(
                    dest => dest.Disponibilidades,
                    opt => opt.MapFrom(src => src.DisponibilidadesDTO)
                );
            CreateMap<DisponibilidadeDTO, Disponibilidade>()
                .ConstructUsing(
                    src => new Disponibilidade(src.DataDisponibilidade,
                    src.HoraInicio, src.StatusDisponibilidade)
                )
                .ForMember(
                    dest => dest.PsicologoId,
                    opt => opt.MapFrom(src => src.PsicologoId)
                );
            CreateMap<EnderecoDTO, Endereco>()
                .ForMember(
                    dest => dest.Cep,
                    opt => opt.MapFrom(src => new Cep(src.Cep))
                );
            CreateMap<ContatoEmergenciaDTO, ContatoEmergencia>()
                .ForMember(
                    dest => dest.Telefone,
                    opt => opt.MapFrom(src => new Telefone(src.Telefone))
                )
                .ForMember(
                    dest => dest.Endereco,
                    opt => opt.MapFrom(src => src.EnderecoDTO)
                );
            CreateMap<ProntuarioDTO, ProntuarioCreateCommand>()
                .ForMember(
                    dest => dest.ContatoEmergencia,
                    opt => opt.MapFrom(src => src.ContatoEmergenciaDTO)
                )
                .ForMember(
                    dest => dest.Medicamentos,
                    opt => opt.MapFrom(src => src.MedicamentosDTO)
                );
            CreateMap<ProntuarioDTO, ProntuarioUpdateCommand>()
                .ForMember(
                    dest => dest.ContatoEmergencia,
                    opt => opt.MapFrom(src => src.ContatoEmergenciaDTO)
                )
                .ForMember(
                    dest => dest.Medicamentos,
                    opt => opt.MapFrom(src => src.MedicamentosDTO)
                );
            CreateMap<MedicamentoDTO, Medicamento>()
                .ConstructUsing(
                    src => new Medicamento(src.Nome, src.Dosagem, src.Frequencia, src.StatusMedicamentoUso)
                )
                .ForMember(
                    dest => dest.ProntuarioId,
                    opt => opt.MapFrom(src => src.ProntuarioId)
                );
            CreateMap<MedicamentoDTO, MedicamentoCreateCommand>();
            CreateMap<MedicamentoDTO, MedicamentoUpdateCommand>();
            CreateMap<SessaoDTO, SessaoCreateCommand>()
                .ForMember(
                    dest => dest.PagamentoCommand,
                    opt => opt.MapFrom(src => src.PagamentoDTO)
                );
            CreateMap<SessaoDTO, SessaoUpdateCommand>()
                .ForMember(
                    dest => dest.PagamentoCommand,
                    opt => opt.MapFrom(src => src.PagamentoDTO)
                );
            CreateMap<PagamentoDTO, PagamentoUpdateCommand>();
            CreateMap<PagamentoDTO, PagamentoCommand>()
                .As<PagamentoUpdateCommand>();
            CreateMap<RegistroSessaoDTO, RegistroSessao>()
                .ConstructUsing(
                    src => new RegistroSessao(src.SessaoId, src.Registro)
                )
                .ForMember(
                    dest => dest.SessaoId,
                    opt => opt.MapFrom(src => src.SessaoId)
                );
            CreateMap<RegistroSessaoDTO, RegistroSessaoCreateCommand>();
            CreateMap<RegistroSessaoDTO, RegistroSessaoUpdateCommand>();
            CreateMap<EscalaSessaoDTO, EscalaSessao>()
                .ConstructUsing(
                    src => new EscalaSessao(src.Humor, src.Ansiedade, src.Sono, src.FuncSocial)
                )
                .ForMember(
                    dest => dest.SessaoId,
                    opt => opt.MapFrom(src => src.SessaoId)
                );
            CreateMap<EscalaSessaoDTO, EscalaSessaoCreateCommand>();
            CreateMap<EscalaSessaoDTO, EscalaSessaoUpdateCommand>();
            CreateMap<DiagnosticoDTO, DiagnosticoCreateCommand>()
                .ForMember(
                    dest => dest.Cid,
                    opt => opt.MapFrom(src => new Cid(src.Cid))
                );
            CreateMap<DiagnosticoDTO, DiagnosticoUpdateCommand>()
                .ForMember(
                    dest => dest.Cid,
                    opt => opt.MapFrom(src => new Cid(src.Cid))
                );
            CreateMap<SaudeMentalDTO, SaudeMentalCommand>();
            CreateMap<MetaTerapeuticaDTO, MetaTerapeutica>()
                .ConstructUsing(
                    src => new MetaTerapeutica(src.Titulo, src.StatusMetaTerapeutica,
                    src.Observacoes)
                )
                .ForMember(
                    dest => dest.HistoricoMedicoId,
                    opt => opt.MapFrom(src => src.HistoricoMedicoId)
                );
            CreateMap<MetaTerapeuticaDTO, MetaTerapeuticaCreateCommand>();
            CreateMap<MetaTerapeuticaDTO, MetaTerapeuticaUpdateCommand>();
            CreateMap<HistoricoMedicoDTO, HistoricoMedicoCreateCommand>()
                .ForMember(
                    dest => dest.SaudeMentalCommand,
                    opt => opt.MapFrom(src => src.SaudeMentalDTO)
                )
                .ForMember(
                    dest => dest.MetasTerapeuticas,
                    opt => opt.MapFrom(src => src.MetasTerapeuticasDTO)
                );
            CreateMap<HistoricoMedicoDTO, HistoricoMedicoUpdateCommand>()
                .ForMember(
                    dest => dest.SaudeMentalCommand,
                    opt => opt.MapFrom(src => src.SaudeMentalDTO)
                )
                .ForMember(
                    dest => dest.MetasTerapeuticas,
                    opt => opt.MapFrom(src => src.MetasTerapeuticasDTO)
                );
            CreateMap<ProgressaoDTO, ProgressaoCreateCommand>();
            CreateMap<RecepcionistaDTO, RecepcionistaCreateCommand>()
                .ForMember(
                    dest => dest.Email,
                    opt => opt.MapFrom(src => new Email(src.Email))
                )
                .ForMember(
                    dest => dest.CpfCnpj,
                    opt => opt.MapFrom(src => new CpfCnpj(src.CpfCnpj))
                );
            CreateMap<RecepcionistaDTO, RecepcionistaUpdateCommand>()
                .ForMember(
                    dest => dest.Email,
                    opt => opt.MapFrom(src => new Email(src.Email))
                )
                .ForMember(
                    dest => dest.CpfCnpj,
                    opt => opt.MapFrom(src => new CpfCnpj(src.CpfCnpj))
                );
            CreateMap<DisponibilidadeDTO, DisponibilidadeCreateCommand>();
            CreateMap<CoberturaPlanoDTO, CoberturaPlano>()
                .ConstructUsing(
                    src => new CoberturaPlano(src.Especialidade, src.PercentualCobertura,
                    src.ValorMaximoCobertura)
                );
            CreateMap<PlanoSaudeDTO, PlanoSaudeCreateCommand>()
                .ForMember(
                    dest => dest.Telefone,
                    opt => opt.MapFrom(src => new Telefone(src.Telefone))
                )
                .ForMember(
                    dest => dest.Email,
                    opt => opt.MapFrom(src => new Email(src.Email))
                )
                .ForMember(
                    dest => dest.CoberturasPlano,
                    opt => opt.MapFrom(src => src.CoberturasPlanoDTO)
                );
            CreateMap<PlanoSaudeDTO, PlanoSaudeUpdateCommand>()
                .ForMember(
                    dest => dest.Telefone,
                    opt => opt.MapFrom(src => new Telefone(src.Telefone))
                )
                .ForMember(
                    dest => dest.Email,
                    opt => opt.MapFrom(src => new Email(src.Email))
                )
                .ForMember(
                    dest => dest.CoberturasPlano,
                    opt => opt.MapFrom(src => src.CoberturasPlanoDTO)
                );
            CreateMap<CoberturaPlanoDTO, CoberturaPlanoUpdateCommand>();
            CreateMap<CoberturaPlanoDTO, CoberturaPlanoCreateCommand>();
        }
    }
}
