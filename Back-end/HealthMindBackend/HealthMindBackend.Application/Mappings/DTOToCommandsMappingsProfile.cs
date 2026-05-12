using AutoMapper;
using HealthMindBackend.API.DTOs;
using HealthMindBackend.Application.Auths.Commands;
using HealthMindBackend.Application.Diagnosticos.Commands;
using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.HistoricosMedicos.Commands;
using HealthMindBackend.Application.Medicamentos.Commands;
using HealthMindBackend.Application.Pacientes.Commands;
using HealthMindBackend.Application.Pagamentos.Commands;
using HealthMindBackend.Application.Progressoes.Commands;
using HealthMindBackend.Application.Prontuarios.Commands;
using HealthMindBackend.Application.Psicologos.Commands;
using HealthMindBackend.Application.Recepcionistas.Commands;
using HealthMindBackend.Application.Sessoes.Commands;
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
            CreateMap<PsicologoCadastroDTO, AuthPsicologoCreateCommand>().ReverseMap();
            CreateMap<RecepcionistaCadastroDTO, AuthRecepcionistaCreateCommand>().ReverseMap();
            CreateMap<PacienteDTO, PacienteCreateCommand>().ReverseMap();
            CreateMap<PacienteDTO, PacienteCreateCommand>().ReverseMap();
            CreateMap<PacienteDTO, PacienteUpdateCommand>().ReverseMap();
            //CreateMap<PsicologoDTO, PsicologoCreateCommand>().ReverseMap();
            CreateMap<PsicologoDTO, PsicologoUpdateCommand>().ReverseMap();
            CreateMap<PsicologoDTO, PsicologoUpdateCommand>()
                .ForMember(dest => dest.Disponibilidades, opt => opt
                .MapFrom(src => src.DisponibilidadesDTO)).ReverseMap();
            //CreateMap<ProntuarioDTO, ProntuarioCreateCommand>().ReverseMap();
            CreateMap<ProntuarioDTO, ProntuarioCreateCommand>()
                .ForMember(dest => dest.Medicamentos, opt => opt
                .MapFrom(src => src.MedicamentosDTO)).ReverseMap();
            CreateMap<ProntuarioDTO, ProntuarioUpdateCommand>().ReverseMap();
            CreateMap<ProntuarioDTO, ProntuarioUpdateCommand>()
                .ForMember(dest => dest.Medicamentos, opt => opt
                .MapFrom(src => src.MedicamentosDTO)).ReverseMap();
            CreateMap<MedicamentoDTO, MedicamentoCreateCommand>().ReverseMap();
            CreateMap<MedicamentoDTO, MedicamentoUpdateCommand>().ReverseMap();
            CreateMap<SessaoDTO, SessaoCreateCommand>()
    .ForMember(dest => dest.PagamentoDTO,
        opt => opt.MapFrom(src => src.PagamentoDTO));
            CreateMap<SessaoDTO, SessaoUpdateCommand>()
                .ForMember(dest => dest.PagamentoDTO,
                    opt => opt.MapFrom(src => src.PagamentoDTO));
            CreateMap<PagamentoDTO, PagamentoUpdateCommand>().ReverseMap();
            CreateMap<DiagnosticoDTO, DiagnosticoCreateCommand>().ReverseMap();
            CreateMap<DiagnosticoDTO, DiagnosticoUpdateCommand>().ReverseMap();
            CreateMap<HistoricoMedicoDTO, HistoricoMedicoCreateCommand>().ReverseMap();
            CreateMap<HistoricoMedicoDTO, HistoricoMedicoUpdateCommand>().ReverseMap();
            CreateMap<ProgressaoDTO, ProgressaoCreateCommand>().ReverseMap();
            //CreateMap<RecepcionistaDTO, RecepcionistaCreateCommand>().ReverseMap();
            CreateMap<RecepcionistaDTO, RecepcionistaUpdateCommand>().ReverseMap();
        }
    }
}
