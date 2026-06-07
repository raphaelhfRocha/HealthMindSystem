using AutoMapper;
using HealthMindBackend.API.DTOs;
using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Sessoes.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.ValueObjects.Agenda.Disponibilidade;
using HealthMindBackend.Domain.ValueObjects.Contato.ContatoEmergencia;
using HealthMindBackend.Domain.ValueObjects.Convenios.PlanoSaudePaciente;
using HealthMindBackend.Domain.ValueObjects.Evolucao.MetasTerapeuticas;
using HealthMindBackend.Domain.ValueObjects.Financeiro.CoberturaPlano;
using HealthMindBackend.Domain.ValueObjects.Financeiro.Pagamento;
using HealthMindBackend.Domain.ValueObjects.Local;
using HealthMindBackend.Domain.ValueObjects.Saude.Medicamento;
using HealthMindBackend.Domain.ValueObjects.Saude.SaudeMental;
using HealthMindBackend.Domain.ValueObjects.Sessao.EscalasSessao;
using HealthMindBackend.Domain.ValueObjects.Sessao.RegistroSessao;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Mappings
{
    public class DomainToDTOMappingsProfile : Profile
    {
        public DomainToDTOMappingsProfile()
        {
            CreateMap<Usuario, UsuarioDTO>()
                .ForPath(
                    dest => dest.Email,
                    opt => opt.MapFrom(src => src.Email.Endereco)
                )
                .ForPath(
                    dest => dest.CpfCnpj,
                    opt => opt.MapFrom(src => src.CpfCnpj.Numero)
                )
                .ReverseMap();
            CreateMap<Recepcionista, RecepcionistaDTO>()
                .ForPath(
                    dest => dest.CpfCnpj,
                    opt => opt.MapFrom(src => src.CpfCnpj.Numero)
                )
                .ReverseMap();
            CreateMap<Usuario, PsicologoCadastroDTO>().ReverseMap();
            CreateMap<Usuario, RecepcionistaCadastroDTO>().ReverseMap();
            CreateMap<Psicologo, PsicologoDTO>()
                .ForMember(
                    dest => dest.DisponibilidadesDTO,
                    opt => opt.MapFrom(src => src.Disponibilidades)
                )
                .ForPath(
                    dest => dest.Email,
                    opt => opt.MapFrom(src => src.Email.Endereco)
                )
                .ForPath(
                    dest => dest.Crp,
                    opt => opt.MapFrom(src => src.Crp.Numero)
                )
                .ForPath(
                    dest => dest.CpfCnpj,
                    opt => opt.MapFrom(src => src.CpfCnpj.Numero)
                )
                .ReverseMap();
            CreateMap<PlanoSaudePaciente, PlanoSaudePacienteDTO>().ReverseMap();
            CreateMap<Endereco, EnderecoDTO>()
                .ForMember(
                    dest => dest.Cep,
                    opt => opt.MapFrom(src => src.Cep.Codigo)
                );
            CreateMap<ContatoEmergencia, ContatoEmergenciaDTO>()
                .ForMember(
                    dest => dest.Telefone,
                    opt => opt.MapFrom(src => src.Telefone.Numero)
                )
                .ForMember(
                    dest => dest.EnderecoDTO,
                    opt => opt.MapFrom(src => src.Endereco)
                );
            CreateMap<Paciente, PacienteDTO>()
                .ForPath(
                    dest => dest.Email,
                    opt => opt.MapFrom(src => src.Email.Endereco)
                )
                .ForPath(
                    dest => dest.CpfCnpj,
                    opt => opt.MapFrom(src => src.CpfCnpj.Numero)
                )
                .ForPath(
                    dest => dest.Telefone,
                    opt => opt.MapFrom(src => src.Telefone.Numero)
                )
                .ForMember(
                    dest => dest.PlanoSaudePacienteDTO,
                    opt => opt.MapFrom(src => src.PlanoSaudePaciente)
                )
                .ReverseMap();
            CreateMap<Prontuario, ProntuarioDTO>()
                .ForMember(
                    dest => dest.ContatoEmergenciaDTO,
                    opt => opt.MapFrom(src => src.ContatoEmergencia)
                )
                .ForMember(
                    dest => dest.MedicamentosDTO,
                    opt => opt.MapFrom(src => src.Medicamentos)
                )
                .ReverseMap();
            CreateMap<Medicamento, MedicamentoDTO>().ReverseMap();
            CreateMap<Progressao, ProgressaoDTO>().ReverseMap();
            CreateMap<HistoricoMedico, HistoricoMedicoDTO>()
                .ForMember(
                    dest => dest.SaudeMentalDTO,
                    opt => opt.MapFrom(src => src.SaudeMental)
                )
                .ForMember(
                    dest => dest.MetasTerapeuticasDTO,
                    opt => opt.MapFrom(src => src.MetasTerapeuticas)
                )
                .ReverseMap();
            CreateMap<Diagnostico, DiagnosticoDTO>()
                .ForPath(
                    dest => dest.Cid,
                    opt => opt.MapFrom(src => src.Cid.Codigo)
                )
                .ReverseMap();
            CreateMap<Sessao, SessaoDTO>()
                .ForMember(
                    dest => dest.PagamentoDTO,
                    opt => opt.MapFrom(src => src.Pagamento)
                )
                .ForMember(
                    dest => dest.RegistrosSessoesDTO,
                    opt => opt.MapFrom(src => src.RegistrosSessoes)
                )
                .ForMember(
                    dest => dest.EscalasSessoesDTO,
                    opt => opt.MapFrom(src => src.EscalasSessoes)
                )
                .ReverseMap();
            CreateMap<RegistroSessao, RegistroSessaoDTO>().ReverseMap();
            CreateMap<EscalaSessao, EscalaSessaoDTO>().ReverseMap();
            CreateMap<SaudeMental, SaudeMentalDTO>().ReverseMap();
            CreateMap<MetaTerapeutica, MetaTerapeuticaDTO>().ReverseMap();
            CreateMap<Pagamento, PagamentoDTO>().ReverseMap();
            CreateMap<Disponibilidade, DisponibilidadeDTO>().ReverseMap();
            CreateMap<PlanoSaude, PlanoSaudeDTO>()
                .ForPath(
                    dest => dest.Telefone,
                    opt => opt.MapFrom(src => src.Telefone.Numero)
                )
                .ForPath(
                    dest => dest.Email,
                    opt => opt.MapFrom(src => src.Email.Endereco)
                )
                .ForMember(
                    dest => dest.CoberturasPlanoDTO,
                    opt => opt.MapFrom(src => src.CoberturasPlano)
                )
                .ReverseMap();
            CreateMap<CoberturaPlano, CoberturaPlanoDTO>().ReverseMap();
        }
    }
}