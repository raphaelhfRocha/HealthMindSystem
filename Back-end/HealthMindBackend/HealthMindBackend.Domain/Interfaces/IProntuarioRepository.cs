using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.ValueObjects.Saude.Medicamento;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Interfaces
{
    public interface IProntuarioRepository
    {
        Task<IEnumerable<Prontuario>> GetAllProntuarios();
        Task<List<Medicamento>> GetMedicamentosByProntuarioId(String prontuarioId);
        Task<Prontuario> GetProntuarioById(String prontuarioId);
        Task<Prontuario> AdicionarProntuario(Prontuario prontuario);
        Task<Prontuario> EditarProntuario(Prontuario prontuario);
        Task<Medicamento> GetMedicamentoByProntuarioIdAndMedicamentoId(String prontuarioId, String medicamentoId);
        Task<Medicamento> AdicionarMedicamento(String prontuarioId, Medicamento medicamento);
        Task<Medicamento> EditarMedicamento(String prontuarioId, String medicamentoId, Medicamento medicamento);
        Task ExcluirMedicamento(String prontuarioId, String medicamentoId);
    }
}
