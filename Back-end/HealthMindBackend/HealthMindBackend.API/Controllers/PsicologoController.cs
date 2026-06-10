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
        /// **1. Clique no botão Try it out na sessão de Parameters(Parâmetros)**
        ///
        /// **2. Em seguida clique no botão Execute**
        /// </remarks>
        [Authorize(Roles = "StsPsicologo,StsRecepcionista")]
        [HttpGet]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllPsicologos()
        {
            return Ok(await _psicologoService.GetAllPsicologos());
        }
        /// <summary>
        /// Obter psicólogo por ID
        /// </summary>
        /// <response code="200">Psicólogos encontrados</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="404">Psicólogos não encontrados</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a obtenção de psicólogo por ID**
        /// 
        /// Como usar:
        /// 
        /// **1. Digite o ID do psicólogo registrado no campo do parâmetro psicologoId**
        /// 
        /// **2. Em seguida clique no botão Execute**
        /// 
        /// **[GET] - /api/Psicologo/{psicologoId}**
        /// </remarks>
        /// <param name="psicologoId">
        /// PsicologoId
        /// </param>
        [Authorize(Roles = "StsPsicologo,StsRecepcionista")]
        [HttpGet("{psicologoId}")]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetPsicologosById(String psicologoId)
        {
            if (psicologoId == null)
                return BadRequest(nameof(psicologoId));

            return Ok(await _psicologoService.GetPsicologoById(psicologoId));
        }

        /// <summary>
        /// Lista de psicólogos por nome
        /// </summary>
        /// <response code="200">Psicólogos encontrados</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="404">Psicólogos não encontrados</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a lista de Psicólogos por nome**
        /// 
        /// Como usar:
        /// 
        /// **1. Digite o Nome do psicólogo registrado no campo do parâmetro nome**
        /// 
        /// **2. Em seguida clique no botão Execute**
        /// 
        /// **[GET] - /api/Psicologo/nome/{nome}**
        /// </remarks>
        /// <param name="nome">
        /// Nome
        /// </param>
        [Authorize(Roles = "StsPsicologo,StsRecepcionista")]
        [HttpGet("nome/{nome}")]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetPsicologosByNome(String nome)
        {
            if (nome == null)
                return BadRequest(nameof(nome));

            return Ok(await _psicologoService.GetPsicologosByNome(nome));
        }

        /// <summary>
        /// Lista de psicólogos por especialidade
        /// </summary>
        /// <response code="200">Psicólogos encontrados</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="404">Psicólogos não encontrados</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a lista de Psicólogos por especialidade**
        /// 
        /// Como usar:
        /// 
        /// **1. Digite a Especialidade do psicólogo registrado no campo do parâmetro especialidade**
        /// 
        /// **2. Em seguida clique no botão Execute**
        /// 
        /// **[GET] - /api/Psicologo/especialidade/{especialidade}**
        /// </remarks>
        /// <param name="especialidade">
        /// Especialidade
        /// </param>
        [Authorize(Roles = "StsPsicologo,StsRecepcionista")]
        [HttpGet("especialidade/{especialidade}")]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetPsicologosByEspecialidade(String especialidade)
        {
            if (especialidade == null)
                return BadRequest(nameof(especialidade));

            return Ok(await _psicologoService.GetPsicologosByEspecialidade(especialidade));
        }

        /// <summary>
        /// Lista de disponbilidades por Id psicólogo
        /// </summary>
        /// <response code="200">Disponibilidades encontradas</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="404">Disponibilidades não encontradas</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a lista de Disponibilidades por Id psicólogo**
        /// 
        /// Como usar:
        /// 
        /// **1. Digite o Id do psicólogo registrado no campo do parâmetro psicologoId**
        /// 
        /// **2. Em seguida clique no botão Execute**
        /// 
        /// **[GET] - /api/Psicologo/{psicologoId}/disponibilidades**
        /// </remarks>
        /// <param name="psicologoId">
        /// ID Psicólogo
        /// </param>
        [Authorize(Roles = "StsPsicologo,StsRecepcionista")]
        [HttpGet("{psicologoId}/disponibilidades")]
        [ProducesResponseType(typeof(DisponibilidadeDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(DisponibilidadeDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(DisponibilidadeDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(DisponibilidadeDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetDisponibilidadesByPsicologoId(String psicologoId)
        {
            if (psicologoId == null)
                return BadRequest(nameof(psicologoId));

            return Ok(await _psicologoService.GetDisponibilidadesByPsicologoId(psicologoId));
        }
        /// <summary>
        /// Exclusão de disponibilidade de psicologo.
        /// </summary>
        /// <param name="psicologoId">Id Psicologo</param>
        /// <param name="disponibilidadeId">Id Disponibilidade</param>
        /// <response code="204">Disponibilidade excluída</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="404">Dados não encontrados</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a exclusão de disponibilidade de psicologo**
        /// 
        /// Como usar:
        /// 
        /// **1. Clique no botão Try it out na sessão de Parameters(Parâmetros)**
        /// 
        /// **2. Digite os parametros de disponibilidade e psicologo nos campos de Id de Disponibilidade e Id do Psicologo**
        /// 
        /// **3. Em seguida clique no botão Execute**
        /// 
        /// </remarks>
        [Authorize(Roles = "StsPsicologo")]
        [HttpDelete("{psicologoId}/disponibilidades/{disponibilidadeId}")]
        [ProducesResponseType(typeof(DisponibilidadeDTO), StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(DisponibilidadeDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(DisponibilidadeDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(DisponibilidadeDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ExcluirDisponibilidade(String psicologoId, String disponibilidadeId)
        {
            if (psicologoId == null)
                return BadRequest(nameof(psicologoId));
            if (disponibilidadeId == null)
                return BadRequest(nameof(disponibilidadeId));

            await _psicologoService.ExcluirDisponibilidade(psicologoId, disponibilidadeId);
            return NoContent();
        }
    }
}