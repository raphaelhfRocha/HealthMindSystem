using HealthMindBackend.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Interfaces
{
    public interface IPacienteService
    {
        Task<IEnumerable<PacienteDTO>> GetAllPacientes();
        Task<List<PacienteDTO>> GetPacientesByPsicologoId(String? psicologoId);
        Task CadastrarPaciente(PacienteDTO pacienteDto);
        Task AtualizarPaciente(PacienteDTO pacienteDto);
    }
}
