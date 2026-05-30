using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class ContatoEmergenciaDTO
    {
        public String ProntuarioId { get; set; }
        public String Nome { get; set; }
        public String Telefone { get; set; }
        public String RelacaoParentesco { get; set; }
        public EnderecoDTO EnderecoDTO { get; set; }
    }
}
