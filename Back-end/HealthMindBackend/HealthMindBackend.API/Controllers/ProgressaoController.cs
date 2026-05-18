using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Application.Services;
using HealthMindBackend.Domain.Validations;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthMindBackend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ProgressaoController : ControllerBase
    {
        private readonly IProgressaoService _progressaoService;

        public ProgressaoController(IProgressaoService progressaoService)
        {
            _progressaoService = progressaoService;            
        }

        /// <summary>
        /// Lista de todas as progressões
        /// </summary>
        /// <response code="200">Progressões encontradas</response>
        /// <response code="404">Progressões não encontradas</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a listagem de todas progressões**
        /// 
        /// Como usar:
        /// 
        /// **1. Clique no botão Try it out na sessão de Parameters(Parâmetros)**
        ///
        /// **2. Em seguida clique no botão Execute**
        /// 
        /// **[GET] - /api/Progressao**
        /// </remarks>
        [Authorize(Roles = "Psicologo")]
        [HttpGet]
        [ProducesResponseType(typeof(ProgressaoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProgressaoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProgressaoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllProgressoes()
        {
            try
            {
                var result = await _progressaoService.GetAllProgressoes();
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
        /// Lista de progressões por Id prontuário
        /// </summary>
        /// <response code="200">Progressões encontradas</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="404">Progressões não encontradas</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a lista de Progressões por Id Prontuário**
        /// 
        /// Como usar:
        /// 
        /// **1. Digite o Id do prontuário registrado no campo do parâmetro prontuarioId**
        /// 
        /// **2. Em seguida clique no botão Execute**
        /// 
        /// **[GET] - /api/Progressao/prontuario/{prontuarioId}**
        /// </remarks>
        /// <param name="prontuarioId">
        /// ID Prontuário
        /// </param>
        [Authorize(Roles = "Psicologo")]
        [HttpGet("prontuario/{prontuarioId}")]
        [ProducesResponseType(typeof(ProgressaoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProgressaoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProgressaoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetProgresoesByProntuarioId(String prontuarioId)
        {
            if (prontuarioId == null)
                return BadRequest(nameof(prontuarioId));
            try
            {
                var result = await _progressaoService.GetProgressoesByProntuarioId(prontuarioId);
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
        /// Registro de progressão
        /// </summary>
        /// <response code="201">Progressão registrado</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a registro de progressão**
        /// 
        /// Como usar:
        ///
        /// **1. Clique no botão Try it out na sessão de Parameters(Parâmetros)**
        /// 
        /// **2. Digite os dados na sessão Request Body(Corpo da requisição) que deseja cadastrar seguindo o modelo abaixo:**
        /// 
        /// **[POST] - /api/Progressao**
        /// ```
        /// {
        ///  "pacienteId": "Id do paciente",
        ///  "prontuarioId": "Id do prontuário",
        ///  "descricao": "Descrição da progressão",
        ///  "dataRegistro": "0000-00-00T00:00:00.000Z"
        /// }
        /// ```
        /// **3. Em seguida clique no botão Execute na sessão Request Body(Corpo da requisição) para enviar os dados**
        /// </remarks>
        /// <param name="progressaoDto">
        ///     **Dados a cadastrar**
        /// </param>
        [Authorize(Roles = "Psicologo")]
        [HttpPost]
        [ProducesResponseType(typeof(ProgressaoDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ProgressaoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProgressaoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> RegistrarProgressao([FromBody] ProgressaoDTO progressaoDto)
        {
            if (progressaoDto == null)
                return BadRequest(nameof(progressaoDto));
            try
            {
                await _progressaoService.AdicionarProgressao(progressaoDto);
                return Created($"/api/progressao", progressaoDto);
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
        /// Exclusão de progressão.
        /// </summary>
        /// <response code="204">Progressão excluída</response>
        /// <response code="400">Dado inválido</response>
        /// <response code="404">Dados não encontrados</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a exclusão de progressões**
        /// 
        /// Como usar:
        /// 
        /// **1. Clique no botão Try it out na sessão de Parameters(Parâmetros)**
        /// 
        /// **2. Digite o parâmetro de histórico médico no campo de Id de progressão**
        /// 
        /// **3. Em seguida clique no botão Execute**
        /// 
        /// **[DELETE] - /api/Progressao/{progressaoId}**
        /// 
        /// </remarks>
        /// <param name="progressaoId">ID Progressão</param>
        [Authorize(Roles = "Psicologo")]
        [HttpDelete("{progressaoId}")]
        [ProducesResponseType(typeof(ProgressaoDTO), StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ProgressaoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProgressaoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProgressaoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ExcluirProgressao(String progressaoId)
        {
            if (progressaoId == null)
                return BadRequest(nameof(progressaoId));
            try
            {
                await _progressaoService.ExcluirProgressao(progressaoId);
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
