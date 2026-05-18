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
    public class DiagnosticoController : ControllerBase
    {
        private readonly IDiagnosticoService _diagnosticoService;

        public DiagnosticoController(IDiagnosticoService diagnosticoService)
        {
            _diagnosticoService = diagnosticoService;
        }


        /// <summary>
        /// Lista de todos os diagnósticos
        /// </summary>
        /// <response code="200">Diagnósticos encontrados</response>
        /// <response code="404">Diagnósticos não encontrados</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a listagem de todos diagnósticos**
        /// 
        /// Como usar:
        /// 
        /// **1. Clique no botão Try it out na sessão de Parameters(Parâmetros)**
        ///
        /// **2. Em seguida clique no botão Execute**
        /// 
        /// **[GET] - /api/Diagnostico**
        /// </remarks>
        [Authorize(Roles = "StsPsicologo")]
        [HttpGet]
        [ProducesResponseType(typeof(DiagnosticoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(DiagnosticoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(DiagnosticoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllDiagnosticos()
        {
            try
            {
                var result = await _diagnosticoService.GetAllDiagnosticos();
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
        /// Lista de diagnósticos por Id prontuário
        /// </summary>
        /// <response code="200">Diagnósticos encontrados</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="404">Diagnósticos não encontrados</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a lista de diagnósticos por Id Prontuário**
        /// 
        /// Como usar:
        /// 
        /// **1. Digite o Id do prontuário registrado no campo do parâmetro prontuarioId**
        /// 
        /// **2. Em seguida clique no botão Execute**
        /// 
        /// **[GET] - /api/Diagnostico/prontuario/{prontuarioId}**
        /// </remarks>
        /// <param name="prontuarioId">
        /// ID Prontuário
        /// </param>
        [Authorize(Roles = "Psicologo")]
        [HttpGet("prontuario/{prontuarioId}")]
        [ProducesResponseType(typeof(DiagnosticoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(DiagnosticoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(DiagnosticoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetDiagnosticosByProntuarioId(String prontuarioId)
        {
            if (prontuarioId == null)
                return BadRequest(nameof(prontuarioId));
            try
            {
                var result = await _diagnosticoService.GetDiagnosticosByProntuarioId(prontuarioId);
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
        /// Registro de diagnóstico
        /// </summary>
        /// <response code="201">Diagnóstico registrado</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a registro de diagnósticos**
        /// 
        /// Como usar:
        /// 
        /// **1. Digite os dados que deseja registrar seguindo o modelo abaixo:**
        /// 
        /// **[POST] - /api/Diagnostico**
        /// ```
        /// {
        ///   "prontuarioId": "Id do prontuário",
        ///   "pacienteId": "Id do paciente",
        ///   "descricao": "Descrição do diagnóstico",
        ///   "cid": "CID do diagnóstico",
        ///   "dataDiagnostico": "0000-00-00T23:00:00.000Z",
        ///   "statusDiagnostico": 0,
        ///   "observacoes": "Observações"
        /// }
        /// ```
        /// **3. Em seguida clique no botão Execute na sessão Request Body(Corpo da requisição) para enviar os dados**
        /// </remarks>
        /// <param name="diagnosticoDto">
        ///     **Dados a cadastrar**
        /// </param>
        [Authorize(Roles = "Psicologo")]
        [HttpPost]
        [ProducesResponseType(typeof(DiagnosticoDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(DiagnosticoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(DiagnosticoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> RegistrarDiagnostico([FromBody] DiagnosticoDTO diagnosticoDto)
        {
            try
            {
                await _diagnosticoService.AdicionarDiagnostico(diagnosticoDto);
                return Created($"/api/diagnostico", diagnosticoDto);
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
        /// Atualização de diagnóstico
        /// </summary>
        /// <response code="200">Diagnóstico editado</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="404">Diagnóstico não encontrado</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a alteração de diagnóstico**
        /// 
        /// 
        /// Como usar:
        /// 
        /// **1. Digite o Id do diagnóstico registrado no campo do parâmetro diagnosticoId**
        /// 
        /// **2. Digite os dados que deseja editar seguindo o modelo abaixo:**
        /// 
        /// **[PUT] - /api/Diagnostico/{diagnosticoId}**
        /// ```
        /// {
        ///   "prontuarioId": "Id do prontuário",
        ///   "pacienteId": "Id do paciente",
        ///   "descricao": "Descrição do diagnóstico",
        ///   "cid": "CID do diagnóstico",
        ///   "dataDiagnostico": "0000-00-00T00:00:00.000Z",
        ///   "statusDiagnostico": 0,
        ///   "observacoes": "Observações"
        /// }
        /// ```
        /// **3. Em seguida clique no botão Execute na sessão Request Body(Corpo da requisição) para enviar os dados**
        /// </remarks>
        /// <param name="diagnosticoId">
        /// ID Diagnóstico
        /// </param>
        /// <param name="diagnosticoDto">
        /// Dados a alterar
        /// </param>
        [Authorize(Roles = "Psicologo")]
        [HttpPut("{diagnosticoId}")]
        [ProducesResponseType(typeof(DiagnosticoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(DiagnosticoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(DiagnosticoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(DiagnosticoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> EditarDiagnostico(String diagnosticoId, [FromBody] DiagnosticoDTO diagnosticoDto)
        {
            if (diagnosticoId == null)
                return BadRequest(nameof(diagnosticoId));
            try
            {
                diagnosticoDto.Id = diagnosticoId;
                await _diagnosticoService.AtualizarDiagnostico(diagnosticoDto);
                return Ok(diagnosticoDto);
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
