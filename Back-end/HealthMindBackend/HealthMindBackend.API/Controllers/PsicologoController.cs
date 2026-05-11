using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Domain.Validations;
using Microsoft.AspNetCore.Mvc;

namespace HealthMindBackend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PsicologoController : ControllerBase
    {
        private readonly IPsicologoService _psicologoService;

        public PsicologoController(IPsicologoService psicologoService)
        {
            _psicologoService = psicologoService;           
        }

        /// <summary>
        /// Lista de todos os psicólogos
        /// </summary>
        /// <response code="200">Psicólogos encontrados</response>
        /// <response code="404">Psicólogos não encontrados</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a listagem de todos psicólogos**
        /// 
        /// Como usar:
        /// 
        /// **1. Clique no botão Try it out na sessão de Parameters(Parametros)**
        ///
        /// **2. Em seguida clique no botão Execute**
        /// </remarks>

        [HttpGet]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllPsicologos()
        {
            try
            {
                var result = await _psicologoService.GetAllPsicologos();
                return Ok(result);
            }
            catch(KeyNotFoundException nf)
            {
                return StatusCode(StatusCodes.Status404NotFound, $"Not Found 404: {nf}");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Erro interno 500: {ex}");
            }
        }

        /// <summary>
        /// Cadastro de psicólogos
        /// </summary>
        /// <response code="201">Psicólogo cadastrado</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a cadastro de psicólogos**
        /// 
        /// Como usar:
        /// 
        /// **1. Digite os dados que deseja editar seguindo o modelo abaixo:**
        /// 
        /// **[POST] - /api/Psicologo**
        /// ```
        /// {
        ///   "Nome": "Nome do psicólogo",
        ///   "Email": "email@email.com",
        ///   "CpfCnpj": "12345678903",
        ///   "StatusCargo": 1,
        ///   "StatusRole": 2,
        ///   "Crp": "123456789",
        ///   "Especialidade": "Especialidade"
        /// }
        /// ```
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CadastrarPsicologo([FromBody] PsicologoDTO psicologoDto)
        {
            try
            {
                await _psicologoService.CadastrarPsicologo(psicologoDto);
                return Created($"/api/psicologo", psicologoDto);
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
        /// Edição de psicólogo
        /// </summary>
        /// <response code="200">Psicólogo editado</response>
        /// <response code="400">Erro ao enviar dados - Bad Request</response>
        /// <response code="404">Psicólogo não encontrado</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a edição de psicólogo**
        /// 
        /// 
        /// Como usar:
        /// 
        /// **1. Digite o Id do psicologo registrado no campo do parametro psicologoId**
        /// **2. Digite os dados que deseja editar seguindo o modelo abaixo:**
        /// 
        /// **[PUT] - /api/Psicologo/{psicologoId}**
        /// ```
        /// {
        ///   "Nome": "Nome do psicólogo",
        ///   "Email": "email@email.com",
        ///   "CpfCnpj": "12345678903",
        ///   "StatusCargo": 1,
        ///   "StatusRole": 2,
        ///   "Crp": "123456789",
        ///   "Especialidade": "Especialidade"
        /// }
        /// ```
        /// </remarks>
        /// <param name="psicologoId">
        /// ID do psicólogo.
        /// </param>
        [HttpPut("{psicologoId}")]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> EditarPsicologo(String psicologoId, [FromBody] PsicologoDTO psicologoDto)
        {
            if (psicologoId == null)
                return BadRequest(nameof(psicologoId));
            try
            {
                psicologoDto.Id = psicologoId;
                await _psicologoService.AtualizarPsicologo(psicologoDto);
                return Ok(psicologoDto);
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
