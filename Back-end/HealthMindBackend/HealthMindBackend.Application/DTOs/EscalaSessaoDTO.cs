using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.DTOs
{
    public class EscalaSessaoDTO
    {
        public String? Id { get; set; }
        public String SessaoId { get; set; }
        public Int32 Humor { get; set; }
        public Int32 Ansiedade { get; set; }
        public Int32 Sono { get; set; }
        public Int32 FuncSocial { get; set; }
    }
}
