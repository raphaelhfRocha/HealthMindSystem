using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class HistoricoMedicoDTO
    {
        public String Id { get; set; }
        public String PacienteId { get; set; }
        public String ProntuarioId { get; set; }
        public String Descricao { get; set; }
        public DateTime DataRegistro { get; set; }
    }
}
