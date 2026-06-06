using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class SessaoDTO
    {
        public String? Id { get; set; }
        public String PacienteId { get; set; }
        public String PsicologoId { get; set; }
        public DateTime DataSessao { get; set; }
        public TimeSpan HoraInicio { get; set; }
        public StatusTipoAtendimentoEnum StatusTipoAtendimento { get; set; }
        public PagamentoDTO? PagamentoDTO { get; set; }
        public List<RegistroSessaoDTO>? RegistrosSessoesDTO { get; set; }
        public List<EscalaSessaoDTO>? EscalasSessoesDTO { get; set; }
    }
}
