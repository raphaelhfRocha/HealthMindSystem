using HealthMindBackend.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Interfaces
{
    public interface IDiagnosticoService
    {
        Task<IEnumerable<DiagnosticoDTO>> GetAllDiagnosticos();
        Task<List<DiagnosticoDTO>> GetDiagnosticosByProntuarioId(String prontuarioId);
        Task AdicionarDiagnostico(DiagnosticoDTO diagnosticoDto);
        Task AtualizarDiagnostico(DiagnosticoDTO diagnosticoDto);
    }
}
