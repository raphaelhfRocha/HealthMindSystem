using AutoMapper;
using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Sessoes.Commands;
using HealthMindBackend.Domain.Entities;
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
            CreateMap<Usuario, UsuarioDTO>().ReverseMap();
            CreateMap<Recepcionista, RecepcionistaDTO>().ReverseMap();
            CreateMap<Psicologo, PsicologoDTO>()
                .ForMember(dest => dest.DisponibilidadesDTO, opt => opt
                .MapFrom(src => src.Disponibilidades)).ReverseMap();
            CreateMap<Paciente, PacienteDTO>().ReverseMap();
            CreateMap<Prontuario, ProntuarioDTO>()
                .ForMember(dest => dest.MedicamentosDTO, opt => opt
                .MapFrom(src => src.Medicamentos)).ReverseMap();
            CreateMap<Progressao, ProgressaoDTO>().ReverseMap();
            CreateMap<HistoricoMedico, HistoricoMedicoDTO>().ReverseMap();
            CreateMap<Diagnostico, DiagnosticoDTO>().ReverseMap();
            CreateMap<Sessao, SessaoDTO>()
                .ForMember(dest => dest.PagamentoDTO,
                opt => opt.MapFrom(src => src.Pagamento)).ReverseMap();
            CreateMap<Pagamento, PagamentoDTO>().ReverseMap();
            CreateMap<Disponibilidade, DisponibilidadeDTO>().ReverseMap();
        }
    }
}