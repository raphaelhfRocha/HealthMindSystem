using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.MetasTerapeuticas.Commands
{
    public class MetaTerapeuticaUpdateCommand : MetaTerapeuticaCommand
    {
        public String Id { get; set; }

        public MetaTerapeuticaUpdateCommand(String id)
        {
            Id = id;
        }
    }
}
