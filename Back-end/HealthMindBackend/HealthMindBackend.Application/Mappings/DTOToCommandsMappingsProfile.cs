using AutoMapper;
using HealthMindBackend.Application.Diagnosticos.Commands;
using HealthMindBackend.Application.Disponibilidades.Commands;
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
using HealthMindBackend.Domain.Entities;
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
            CreateMap<PacienteDTO, PacienteCreateCommand>();
            CreateMap<PacienteDTO, PacienteUpdateCommand>();
            CreateMap<PsicologoDTO, PsicologoCreateCommand>();
            CreateMap<PsicologoDTO, PsicologoUpdateCommand>()
                .ForMember(dest => dest.Disponibilidades, opt => opt
                .MapFrom(src => src.DisponibilidadesDTO));
            CreateMap<DisponibilidadeDTO, Disponibilidade>()
                .ConstructUsing(src => new Disponibilidade(src.DataDisponibilidade, src.HoraInicio, src.StatusDisponibilidade))
                .ForMember(dest => dest.PsicologoId, opt => opt.MapFrom(src => src.PsicologoId));
            CreateMap<ProntuarioDTO, ProntuarioCreateCommand>()
                .ForMember(dest => dest.Medicamentos, opt => opt
                .MapFrom(src => src.MedicamentosDTO));
            CreateMap<ProntuarioDTO, ProntuarioUpdateCommand>()
                .ForMember(dest => dest.Medicamentos, opt => opt
                .MapFrom(src => src.MedicamentosDTO));
            CreateMap<MedicamentoDTO, Medicamento>()
                .ConstructUsing(src => new Medicamento(src.Nome, src.Dosagem, src.Frequencia))
                .ForMember(dest => dest.ProntuarioId, opt => opt.MapFrom(src => src.ProntuarioId));
            CreateMap<MedicamentoDTO, MedicamentoCreateCommand>();
            CreateMap<MedicamentoDTO, MedicamentoUpdateCommand>();
            CreateMap<SessaoDTO, SessaoCreateCommand>()
    .ForMember(dest => dest.PagamentoDTO,
        opt => opt.MapFrom(src => src.PagamentoDTO));
            CreateMap<SessaoDTO, SessaoUpdateCommand>()
                .ForMember(dest => dest.PagamentoDTO,
                    opt => opt.MapFrom(src => src.PagamentoDTO));
            CreateMap<PagamentoDTO, PagamentoUpdateCommand>();
            CreateMap<DiagnosticoDTO, DiagnosticoCreateCommand>();
            CreateMap<DiagnosticoDTO, DiagnosticoUpdateCommand>();
            CreateMap<HistoricoMedicoDTO, HistoricoMedicoCreateCommand>();
            CreateMap<HistoricoMedicoDTO, HistoricoMedicoUpdateCommand>();
            CreateMap<ProgressaoDTO, ProgressaoCreateCommand>();
            CreateMap<RecepcionistaDTO, RecepcionistaCreateCommand>();
            CreateMap<RecepcionistaDTO, RecepcionistaUpdateCommand>();
            CreateMap<DisponibilidadeDTO, DisponibilidadeCreateCommand>();
        }
    }
}
