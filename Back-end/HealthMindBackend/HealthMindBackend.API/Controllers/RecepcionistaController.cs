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
    public class RecepcionistaController : ControllerBase
    {
        private readonly IRecepcionistaService _recepcionistaService;

        public RecepcionistaController(IRecepcionistaService recepcionistaService)
        {
            _recepcionistaService = recepcionistaService;
        }

        /// <summary>
        /// Lista de recepcionistas
        /// </summary>
        /// <response code="200">Recepcionistas encontrados</response>
        /// <response code="404">Recepcionistas não encontrados</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a listagem de recepcionistas**
        /// 
        /// Como usar:
        /// 
        /// **1. Clique no botão Try it out na sessão de Parameters(Parâmetros)**
        ///
        /// **2. Em seguida clique no botão Execute**
        /// 
        /// **[GET] - /api/Recepcionista**
        /// </remarks>
        [Authorize(Roles = "StsPsicologo")]
        [HttpGet]
        [ProducesResponseType(typeof(RecepcionistaDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(RecepcionistaDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(RecepcionistaDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllRecepcionistas()
        {
            return Ok(await _recepcionistaService.GetAllRecepcionistas());
        }

        /// <summary>
        /// Edição de recepcionista
        /// </summary>
        /// <response code="200">Recepcionista editado</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="404">Recepcionista não encontrado</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a edição de paciente**
        /// 
        /// 
        /// Como usar:
        /// 
        /// **1. Digite o Id do recepcionista registrado no campo do parâmetro recepcionistaId**
        /// 
        /// **2. Digite os dados que deseja editar seguindo o modelo abaixo:**
        /// 
        /// **[PUT] - /api/Recepcionista/{recepcionistaId}**
        /// ```
        /// {
        ///   "nome": "Nome recepcionista",
        ///   "email": "E-mail recepcionista",
        ///   "cpfCnpj": "894838938923",
        ///   "statusCargo": 0,
        ///   "statusRole": 0
        /// }
        /// ```
        /// **3. Em seguida clique no botão Execute na sessão Request Body(Corpo da requisição) para enviar os dados**
        /// </remarks>
        /// <param name="recepcionistaId">
        /// ID Recepcionista
        /// </param>
        /// <param name="recepcionistaDto">
        /// Dados a alterar
        /// </param>
        [Authorize(Roles = "StsPsicologo")]
        [HttpPut("{recepcionistaId}")]
        [ProducesResponseType(typeof(RecepcionistaDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(RecepcionistaDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(RecepcionistaDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(RecepcionistaDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> EditarRecepcionista(String recepcionistaId, [FromBody] RecepcionistaDTO recepcionistaDto)
        {
            if (recepcionistaId == null)
                return BadRequest(nameof(recepcionistaId));

            recepcionistaDto.Id = recepcionistaId;
            await _recepcionistaService.AtualizarRecepcionista(recepcionistaDto);
            return Ok(recepcionistaDto);
        }

        /// <summary>
        /// Exclusão de recepcionista.
        /// </summary>
        /// <response code="204">Recepcionista excluído</response>
        /// <response code="400">Dado inválido</response>
        /// <response code="404">Dados não encontrados</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a exclusão do recepcionista**
        /// 
        /// Como usar:
        /// 
        /// **1. Clique no botão Try it out na sessão de Parameters(Parâmetros)**
        /// 
        /// **2. Digite o parâmetro de recepcionista no campo de Id do Recepcionista**
        /// 
        /// **3. Em seguida clique no botão Execute**
        /// 
        /// </remarks>
        /// <param name="recepcionistaId">ID Recepcionista</param>
        [Authorize(Roles = "StsPsicologo")]
        [HttpDelete("{recepcionistaId}")]
        [ProducesResponseType(typeof(RecepcionistaDTO), StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(RecepcionistaDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(RecepcionistaDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(RecepcionistaDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ExcluirRecepcionista(String recepcionistaId)
        {
            if (recepcionistaId == null)
                return BadRequest(nameof(recepcionistaId));

            await _recepcionistaService.ExcluirRecepcionista(recepcionistaId);
            return NoContent();
        }
    }
}
