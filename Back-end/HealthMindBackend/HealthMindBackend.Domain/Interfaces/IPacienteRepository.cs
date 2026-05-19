using HealthMindBackend.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Interfaces
{
    public interface IPacienteRepository
    {
        Task<IEnumerable<Paciente>> GetAllPacientes();
        Task<List<Paciente>> GetPacientesByNome(String nome);
        Task<Paciente> GetPacienteById(String pacienteId);
        Task<Paciente> GetPacienteByCpfCnpj(String cpfCnpj);
        Task<Paciente> GetPacienteByEmail(String email);
        Task<List<Paciente>> GetPacientesByPsicologoId(String? psicologoId);
        Task<Paciente> CadastrarPaciente(Paciente paciente);
        Task<Paciente> EditarPaciente(String id, Paciente paciente);
    }
}
