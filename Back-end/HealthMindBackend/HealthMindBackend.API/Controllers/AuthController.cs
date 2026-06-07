using HealthMindBackend.API.DTOs;
using HealthMindBackend.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthMindBackend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(LoginDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(LoginDTO), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(LoginDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(LoginDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Login(LoginDTO loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(nameof(loginDto));

            var usuarioAutenticado = await _authService.Login(loginDto.Email, loginDto.Senha);
            return Ok(usuarioAutenticado);
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
        /// **1. Clique no botão Try it out na sessão de Parameters(Parâmetros)**
        /// 
        /// **2. Digite os dados na sessão Request Body(Corpo da requisição) que deseja cadastrar seguindo o modelo abaixo:**
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
        /// **3. Em seguida clique no botão Execute na sessão Request Body(Corpo da requisição) para enviar os dados**
        /// </remarks>
        /// <param name="psicologoCadastroDto">
        ///     **Dados a cadastrar**
        /// </param>
        [Authorize(Roles = "StsPsicologo")]
        [HttpPost("psicologo")]
        [ProducesResponseType(typeof(PsicologoCadastroDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(PsicologoCadastroDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(PsicologoCadastroDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CadastrarPsicologo([FromBody] PsicologoCadastroDTO psicologoCadastroDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(nameof(psicologoCadastroDto));

            await _authService.CadastrarPsicologo(psicologoCadastroDto);
            return Created($"/api/auth/psicologo", psicologoCadastroDto);
        }

        /// <summary>
        /// Cadastro de recepcionista
        /// </summary>
        /// <response code="201">Recepcionista cadastrado</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a cadastro de recepcionista**
        /// 
        /// Como usar:
        /// 
        /// **1. Clique no botão Try it out na sessão de Parameters(Parâmetros)**
        /// 
        /// **2. Digite os dados na sessão Request Body(Corpo da requisição) que deseja cadastrar seguindo o modelo abaixo:**
        /// 
        /// **[POST] - /api/Recepcionista**
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
        /// <param name="recepcionistaCadastroDto">
        ///     **Dados a cadastrar**
        /// </param>
        [Authorize(Roles = "StsPsicologo")]
        [HttpPost("recepcionista")]
        [ProducesResponseType(typeof(RecepcionistaCadastroDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(RecepcionistaCadastroDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(RecepcionistaCadastroDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CadastrarRecepcionista([FromBody] RecepcionistaCadastroDTO recepcionistaCadastroDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(nameof(recepcionistaCadastroDto));

            await _authService.CadastrarRecepcionista(recepcionistaCadastroDto);
            return Created($"/api/auth/recepcionista", recepcionistaCadastroDto);
        }
    }
}
