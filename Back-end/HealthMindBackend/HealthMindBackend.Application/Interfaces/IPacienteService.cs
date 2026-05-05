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
        Task CadastrarPaciente(PacienteDTO pacienteDto);
        Task AtualizarPaciente(PacienteDTO pacienteDto);
        Task ExcluirPaciente(String pacienteId);
    }
}
