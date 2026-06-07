using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class HistoricoMedicoDTO
    {
        public String? Id { get; set; }
        public String PacienteId { get; set; }
        public String ProntuarioId { get; set; }
        public String? RazaoAtendimento { get; set; }
        public String? ImpactoRazao { get; set; }
        public String? ExpectativaAtendimento { get; set; }
        public DateTime DataRegistro { get; set; }
        public SaudeMentalDTO? SaudeMentalDTO { get; set; }
        public List<MetaTerapeuticaDTO>? MetasTerapeuticasDTO { get; set; }
    }
}
