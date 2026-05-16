using HealthMindBackend.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class DiagnosticoDTO
    {
        public String? Id { get; set; }
        public String ProntuarioId { get; set; }
        public String PacienteId { get; set; }
        [Required(ErrorMessage = "Descrição Diagnóstico obrigatória")]
        public String Descricao { get; set; }
        [Required(ErrorMessage = "CID Diagnóstico obrigatória")]
        public String Cid { get; set; }
        [Required(ErrorMessage = "Data Diagnóstico obrigatória")]
        public DateTime DataDiagnostico { get; set; }
        public StatusDiagnosticoEnum StatusDiagnostico { get; set; }
        public String Observacoes { get; set; }
    }
}
