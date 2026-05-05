using AutoMapper;
using HealthMindBackend.Application.Diagnosticos.Commands;
using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.HistoricosMedicos.Commands;
using HealthMindBackend.Application.Medicamentos.Commands;
using HealthMindBackend.Application.Pacientes.Commands;
using HealthMindBackend.Application.Pagamentos.Commands;
using HealthMindBackend.Application.Progressoes.Commands;
using HealthMindBackend.Application.Prontuarios.Commands;
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
            CreateMap<PacienteDTO, PacienteCreateCommand>().ReverseMap();
            CreateMap<PacienteDTO, PacienteUpdateCommand>().ReverseMap();
            CreateMap<ProntuarioDTO, ProntuarioCreateCommand>().ReverseMap();
            CreateMap<ProntuarioDTO, ProntuarioUpdateCommand>().ReverseMap();
            CreateMap<MedicamentoDTO, MedicamentoCreateCommand>().ReverseMap();
            CreateMap<MedicamentoDTO, MedicamentoUpdateCommand>().ReverseMap();
            CreateMap<SessaoDTO, SessaoCreateCommand>().ReverseMap();
            CreateMap<SessaoDTO, SessaoUpdateCommand>().ReverseMap();
            CreateMap<PagamentoDTO, PagamentoUpdateCommand>().ReverseMap();
            CreateMap<DiagnosticoDTO, DiagnosticoCreateCommand>().ReverseMap();
            CreateMap<DiagnosticoDTO, DiagnosticoUpdateCommand>().ReverseMap();
            CreateMap<HistoricoMedicoDTO, HistoricoMedicoCreateCommand>().ReverseMap();
            CreateMap<HistoricoMedicoDTO, HistoricoMedicoUpdateCommand>().ReverseMap();
            CreateMap<ProgressaoDTO, ProgressaoCreateCommand>().ReverseMap();
            CreateMap<RecepcionistaDTO, RecepcionistaCreateCommand>().ReverseMap();
            CreateMap<RecepcionistaDTO, RecepcionistaUpdateCommand>().ReverseMap();
        }
    }
}
