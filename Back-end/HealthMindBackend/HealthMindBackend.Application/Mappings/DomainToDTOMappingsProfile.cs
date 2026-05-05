using AutoMapper;
using HealthMindBackend.Application.DTOs;
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
            CreateMap<Psicologo, PsicologoDTO>().ReverseMap();
            CreateMap<Paciente, PacienteDTO>().ReverseMap();
            CreateMap<Prontuario, ProntuarioDTO>().ReverseMap();
            CreateMap<Medicamento, MedicamentoDTO>().ReverseMap();
            CreateMap<Progressao, ProgressaoDTO>().ReverseMap();
            CreateMap<HistoricoMedico, HistoricoMedicoDTO>().ReverseMap();
            CreateMap<Diagnostico, DiagnosticoDTO>().ReverseMap();
            CreateMap<Sessao, SessaoDTO>().ReverseMap();
            CreateMap<Pagamento, PagamentoDTO>().ReverseMap();
        }
    }
}
