using AutoMapper;
using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Sessoes.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.ValueObjects.Agenda.Disponibilidade;
using HealthMindBackend.Domain.ValueObjects.Financeiro.Pagamento;
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
            CreateMap<HistoricoMedico, HistoricoMedicoDTO>().ReverseMap();
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
                .ReverseMap();
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
                    dest => dest.CoberturaPlanoDTO,
                    opt => opt.MapFrom(src => src.CoberturaPlano)
                )
                .ReverseMap();
        }
    }
}