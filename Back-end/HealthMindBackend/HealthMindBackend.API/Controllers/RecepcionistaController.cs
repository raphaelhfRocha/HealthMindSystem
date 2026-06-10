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
    }
}
