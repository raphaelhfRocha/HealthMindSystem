using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Domain.Validations;
using Microsoft.AspNetCore.Mvc;

namespace HealthMindBackend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HistoricoMedicoController : ControllerBase
    {
        private readonly IHistoricoMedicoService _historicoMedicoService;

        public HistoricoMedicoController(IHistoricoMedicoService historicoMedicoService)
        {
            _historicoMedicoService = historicoMedicoService;
        }


        /// <summary>
        /// Lista de todos os históricos médicos
        /// </summary>
        /// <response code="200">Históricos médicos encontrados</response>
        /// <response code="404">Históricos médicos não encontrados</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a listagem de todos históricos médicos**
        /// 
        /// Como usar:
        /// 
        /// **1. Clique no botão Try it out na sessão de Parameters(Parâmetros)**
        ///
        /// **2. Em seguida clique no botão Execute**
        /// 
        /// **[GET] - /api/HistoricoMedico**
        /// </remarks>
        [HttpGet]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllHistoricosMedicos()
        {
            try
            {
                var result = await _historicoMedicoService.GetAllHistoricoMedicos();
                return Ok(result);
            }
            catch (KeyNotFoundException nf)
            {
                return StatusCode(StatusCodes.Status404NotFound, $"Not Found 404: {nf}");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Erro interno 500: {ex}");
            }
        }

        /// <summary>
        /// Lista de históricos médicos por Id prontuário
        /// </summary>
        /// <response code="200">Históricos médicos encontrados</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="404">Históricos médicos não encontrados</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a lista de históricos médicos por Id Prontuário**
        /// 
        /// Como usar:
        /// 
        /// **1. Digite o Id do prontuário registrado no campo do parâmetro prontuarioId**
        /// 
        /// **2. Em seguida clique no botão Execute**
        /// 
        /// **[GET] - /api/HistoricoMedico/prontuario/{prontuarioId}**
        /// </remarks>
        /// <param name="prontuarioId">
        /// ID Prontuário
        /// </param>
        [HttpGet("prontuario/{prontuarioId}")]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetHistoricosMedicosByProntuarioId(String prontuarioId)
        {
            if (prontuarioId == null)
                return BadRequest(nameof(prontuarioId));
            try
            {
                var result = await _historicoMedicoService.GetHistoricosByProntuarioId(prontuarioId);
                return Ok(result);
            }
            catch (KeyNotFoundException nf)
            {
                return StatusCode(StatusCodes.Status404NotFound, $"Not Found 404: {nf}");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Erro interno 500: {ex}");
            }
        }


        /// <summary>
        /// Registro de histórico médico
        /// </summary>
        /// <response code="201">Histórico médico registrado</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a registro de históricos médicos**
        /// 
        /// Como usar:
        /// 
        /// **1. Clique no botão Try it out na sessão de Parameters(Parâmetros)**
        /// 
        /// **2. Digite os dados na sessão Request Body(Corpo da requisição) que deseja cadastrar seguindo o modelo abaixo:**
        /// 
        /// **[POST] - /api/HistoricoMedico**
        /// ```
        /// {
        ///   "pacienteId": "Id do paciente",
        ///   "prontuarioId": "Id do prontuário",
        ///   "descricao": "Descrição do histórico",
        ///   "dataRegistro": "0000-00-00T00:00:00.000Z"
        /// }
        /// ```
        /// **3. Em seguida clique no botão Execute na sessão Request Body(Corpo da requisição) para enviar os dados**
        /// </remarks>
        /// <param name="historicoMedicoDto">
        ///     **Dados a cadastrar**
        /// </param>
        [HttpPost]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> RegistrarHistoricoMedico([FromBody] HistoricoMedicoDTO historicoMedicoDto)
        {
            if (historicoMedicoDto == null)
                return BadRequest(nameof(historicoMedicoDto));
            try
            {
                await _historicoMedicoService.AdicionarHistoricoMedico(historicoMedicoDto);
                return Created($"/api/historicoMedico", historicoMedicoDto);
            }
            catch (DomainExceptionValidation br)
            {
                return StatusCode(StatusCodes.Status400BadRequest, $"Bad Request 400: {br}");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Erro interno 500: {ex}");
            }
        }


        /// <summary>
        /// Atualização de Histórico médico
        /// </summary>
        /// <response code="200">Histórico médico editado</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="404">Histórico médico não encontrado</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a alteração de Histórico médico**
        /// 
        /// 
        /// Como usar:
        /// 
        /// **1. Digite o Id do diagnóstico registrado no campo do parâmetro históricoId**
        /// 
        /// **2. Digite os dados que deseja editar seguindo o modelo abaixo:**
        /// 
        /// **[PUT] - /api/HistoricoMedico/{históricoId}**
        /// ```
        /// {
        ///   "pacienteId": "Id do paciente",
        ///   "prontuarioId": "Id do prontuário",
        ///   "descricao": "Descrição do histórico",
        ///   "dataRegistro": "0000-00-00T00:00:00.000Z"
        /// }
        /// ```
        /// **3. Em seguida clique no botão Execute na sessão Request Body(Corpo da requisição) para enviar os dados**
        /// </remarks>
        /// <param name="historicoId">
        /// ID Histórico médico
        /// </param>
        /// <param name="historicoMedicoDto">
        /// Dados a alterar
        /// </param>
        [HttpPut("{historicoId}")]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> EditarHistoricoMedico(String historicoId, [FromBody] HistoricoMedicoDTO historicoMedicoDto)
        {
            if(historicoId == null)
                return BadRequest(nameof(historicoId));
            try
            {
                historicoMedicoDto.Id = historicoId;
                await _historicoMedicoService.AtualizarHistoricoMedico(historicoMedicoDto);
                return Ok(historicoMedicoDto);
            }
            catch (DomainExceptionValidation br)
            {
                return StatusCode(StatusCodes.Status400BadRequest, $"Bad Request 400: {br}");
            }
            catch (KeyNotFoundException nf)
            {
                return StatusCode(StatusCodes.Status404NotFound, $"Not Found 404: {nf}");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Erro interno 500: {ex}");
            }
        }


        /// <summary>
        /// Exclusão de histórico médico.
        /// </summary>
        /// <response code="204">Histórico médico excluído</response>
        /// <response code="400">Dado inválido</response>
        /// <response code="404">Dado não encontrado</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a exclusão de histórico médico**
        /// 
        /// Como usar:
        /// 
        /// **1. Clique no botão Try it out na sessão de Parameters(Parâmetros)**
        /// 
        /// **2. Digite o parâmetro de histórico médico no campo de Id do histórico**
        /// 
        /// **3. Em seguida clique no botão Execute**
        /// 
        /// **[DELETE] - /api/HistoricoMedico/{históricoId}**
        /// 
        /// </remarks>
        /// <param name="historicoId">Id Histórico médico</param>
        [HttpDelete("{historicoId}")]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ExcluirHistoricoMedico(String historicoId)
        {
            if (historicoId == null)
                return BadRequest(nameof(historicoId));
            try
            {
                await _historicoMedicoService.ExcluirHistoricoMedico(historicoId);
                return NoContent();
            }
            catch (DomainExceptionValidation br)
            {
                return StatusCode(StatusCodes.Status400BadRequest, $"Bad Request 400: {br}");
            }
            catch (KeyNotFoundException nf)
            {
                return StatusCode(StatusCodes.Status404NotFound, $"Not Found 404: {nf}");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Erro interno 500: {ex}");
            }
        }
    }
}
