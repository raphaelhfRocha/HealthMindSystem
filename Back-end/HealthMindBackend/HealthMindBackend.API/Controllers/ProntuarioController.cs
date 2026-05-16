using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Validations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Logging;

namespace HealthMindBackend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProntuarioController : ControllerBase
    {
        private readonly IProntuarioService _prontuarioService;

        public ProntuarioController(IProntuarioService prontuarioService)
        {
            _prontuarioService = prontuarioService;
        }

        /// <summary>
        /// Lista de todos os prontuários
        /// </summary>
        /// <response code="200">Prontuários encontrados</response>
        /// <response code="404">Prontuários não encontrados</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a listagem de todos prontuários**
        /// 
        /// Como usar:
        /// 
        /// **1. Clique no botão Try it out na sessão de Parameters(Parâmetros)**
        ///
        /// **2. Em seguida clique no botão Execute**
        /// </remarks>
        [HttpGet]
        [ProducesResponseType(typeof(ProntuarioDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProntuarioDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProntuarioDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllProntuarios()
        {
            return Ok(await _prontuarioService.GetAllProntuarios());
        }

        /// <summary>
        /// Cadastro de prontuário
        /// </summary>
        /// <response code="201">Prontuário cadastrado</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a cadastro de prontuário**
        /// 
        /// Como usar:
        /// 
        /// **1. Clique no botão Try it out na sessão de Parameters(Parâmetros)**
        /// 
        /// **2. Digite os dados na sessão Request Body(Corpo da requisição) que deseja cadastrar seguindo o modelo abaixo:**
        /// 
        /// **[POST] - /api/Prontuario**
        /// ```
        /// {
        ///    "pacienteId": "Id do paciente" ,
        ///    "descricao": "Descrição do prontuário",
        ///    "dataAbertura": "0000-00-00T00:00:00.000Z",
        ///    "statusProntuario": 1,
        ///    "medicamentosDTO": [
        ///    {
        ///      "nome": "Nome do medicamento",
        ///      "dosagem": "Dosagem do medicamento",
        ///      "frequencia": "Frequencia do consumo do medicamento"
        ///    }
        ///  ]
        /// }
        /// ```
        /// **3. Em seguida clique no botão Execute na sessão Request Body(Corpo da requisição) para enviar os dados**
        /// </remarks>
        /// <param name="prontuarioDto">Dados do prontuário a cadastrar.</param>
        [HttpPost]
        [ProducesResponseType(typeof(ProntuarioDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ProntuarioDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProntuarioDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> RegistrarProntuario([FromBody] ProntuarioDTO prontuarioDto)
        {
            if (!prontuarioDto.DataAbertura.HasValue || prontuarioDto.DataAbertura.Value == DateTime.MinValue)
                prontuarioDto.DataAbertura = DateTime.UtcNow;

            await _prontuarioService.RegistrarProntuario(prontuarioDto);
            return Created($"/api/prontuario", prontuarioDto);
        }

        /// <summary>
        /// Atualização de prontuário
        /// </summary>
        /// <param name="prontuarioId">Id do prontuário.</param>
        /// <param name="prontuarioDto">Dados a atualizar.</param>
        /// <response code="200">Prontuário atualizado</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="404">Prontuário não encontrado</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a atualização de prontuário**
        /// 
        /// Como usar:
        /// 
        /// **1. Clique no botão Try it out na sessão de Parameters(Parâmetros)**
        /// 
        /// **2. Digite no campo Id do prontuário**
        /// 
        /// **3. Digite os dados na sessão Request Body(Corpo da requisição) que deseja cadastrar seguindo o modelo abaixo:**
        /// 
        /// **[PUT] - /api/Prontuario/{prontuarioId}**
        /// ```
        /// {
        ///   "pacienteId": "PAC-001",
        ///   "descricao": "Nova descrição do prontuário",
        ///   "statusProntuario": 2,
        ///   "medicamentosDTO": [
        ///     {
        ///       "id": "MED-001",  // Com ID = atualiza existente
        ///       "prontuarioId": "PRT-001",
        ///       "nome": "Nome atualizado",
        ///       "dosagem": "500mg",
        ///       "frequencia": "8 em 8 horas"
        ///     },
        ///     {
        ///       // Sem ID = cria novo
        ///       "prontuarioId": "PRT-001",
        ///       "nome": "Novo medicamento",
        ///       "dosagem": "250mg",
        ///       "frequencia": "12 em 12 horas"
        ///     }
        ///   ]
        /// }
        /// ```
        /// **3. Em seguida clique no botão Execute na sessão Request Body(Corpo da requisição) para enviar os dados**
        /// </remarks>
        [HttpPut("{prontuarioId}")]
        [ProducesResponseType(typeof(ProntuarioDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProntuarioDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProntuarioDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProntuarioDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> EditarProntuario(String prontuarioId, [FromBody] ProntuarioDTO prontuarioDto)
        {
            if (String.IsNullOrWhiteSpace(prontuarioId))
                return BadRequest("Id do prontuário é obrigatório.");

            prontuarioDto.Id = prontuarioId;

            // Busca os medicamentos existentes no banco de dados
            var medicamentosExistentes = await _prontuarioService.GetMedicamentosByProntuarioId(prontuarioId) ?? new List<MedicamentoDTO>();

            if (prontuarioDto.MedicamentosDTO != null)
            {
                foreach (var medicamentoDto in prontuarioDto.MedicamentosDTO)
                {
                    medicamentoDto.ProntuarioId = prontuarioId;

                    if (!String.IsNullOrWhiteSpace(medicamentoDto.Id))
                    {
                        // Medicamento com ID: atualizar existente
                        var medicamentoExistente = medicamentosExistentes.FirstOrDefault(m => m.Id == medicamentoDto.Id);
                        if (medicamentoExistente != null)
                        {
                            await _prontuarioService.EditarMedicamento(prontuarioId, medicamentoDto.Id, medicamentoDto);
                        }
                    }
                    else
                    {
                        // Medicamento sem ID: criar novo
                        await _prontuarioService.RegistrarMedicamento(medicamentoDto);
                    }
                }
            }

            await _prontuarioService.EditarProntuario(prontuarioDto);
            return Ok(prontuarioDto);
        }

        /// <summary>
        /// Exclusão de medicamento do prontuário.
        /// </summary>
        /// <param name="prontuarioId">Id Prontuário</param>
        /// <param name="medicamentoId">Id Medicamento</param>
        /// <response code="204">Medicamento excluído</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="404">Dados não encontrados</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a exclusão de medicamento do prontuário**
        /// 
        /// Como usar:
        /// 
        /// **1. Clique no botão Try it out na sessão de Parameters(Parâmetros)**
        /// 
        /// **2. Digite os parametros de medicamento e prontuário nos campos de Id do Medicamento e Id do Prontuário**
        /// 
        /// **3. Em seguida clique no botão Execute**
        /// 
        /// </remarks>
        [HttpDelete("{prontuarioId}")]
        [ProducesResponseType(typeof(MedicamentoDTO), StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(MedicamentoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(MedicamentoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(MedicamentoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ExcluirMedicamento(String prontuarioId, String medicamentoId)
        {
            if (prontuarioId == null)
                return BadRequest(nameof(prontuarioId));
            if (medicamentoId == null)
                return BadRequest(nameof(medicamentoId));
            
            await _prontuarioService.ExcluirMedicamento(prontuarioId, medicamentoId);
            return NoContent();
        }
    }
}
