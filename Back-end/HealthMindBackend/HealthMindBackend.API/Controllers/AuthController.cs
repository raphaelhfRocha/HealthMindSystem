using HealthMindBackend.API.DTOs;
using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthMindBackend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IPsicologoService _psicologoService;
        private readonly IRecepcionistaService _recepcionistaService;

        public AuthController(IAuthService authService, IPsicologoService psicologoService, IRecepcionistaService recepcionistaService)
        {
            _authService = authService;
            _psicologoService = psicologoService;
            _recepcionistaService = recepcionistaService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(LoginDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(LoginDTO), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(LoginDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(LoginDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Login(LoginDTO loginDto)
        {
            var loginRequestDto = new LoginRequestDTO
            {
                Email = loginDto.Email,
                Senha = loginDto.Senha
            };

            var usuarioAutenticado = await _authService.Login(loginRequestDto);
            return Ok(usuarioAutenticado);
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        [Authorize(Roles = "StsPsicologo")]
        [HttpPost("psicologos")]
        [ProducesResponseType(typeof(PsicologoCadastroDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(PsicologoCadastroDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(PsicologoCadastroDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CadastrarPsicologo([FromBody] PsicologoCadastroDTO psicologoCadastroDto)
        {
            var psicologoDto = new PsicologoDTO
            {
                Nome = psicologoCadastroDto.Nome,
                CpfCnpj = psicologoCadastroDto.CpfCnpj,
                StatusCargo = psicologoCadastroDto.StatusCargo,
                StatusRole = psicologoCadastroDto.StatusRole,
                Crp = psicologoCadastroDto.Crp,
                Especialidade = psicologoCadastroDto.Especialidade,
                ValorConsulta = psicologoCadastroDto.ValorConsulta
            };

            await _authService.CadastrarPsicologo(psicologoDto);
            return Created($"/api/auth/psicologo", psicologoDto);
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        [Authorize(Roles = "StsPsicologo")]
        [HttpPut("psicologos/{psicologoId}")]
        [ProducesResponseType(typeof(PsicologoEdicaoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(PsicologoEdicaoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(PsicologoEdicaoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(PsicologoEdicaoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> EditarPsicologo(String psicologoId, [FromBody] PsicologoEdicaoDTO psicologoEdicaoDto)
        {
            if (psicologoId == null)
                return BadRequest(nameof(psicologoId));

            var psicologoFound = await _psicologoService.GetPsicologoById(psicologoId);
            var usuarioFound = await _authService.GetUsuarioById(psicologoFound.UsuarioId);

            var psicologoDto = new PsicologoDTO
            {
                Id = psicologoId,
                Nome = psicologoEdicaoDto.Nome,
                Email = usuarioFound.Email,
                Senha = psicologoEdicaoDto.Senha,
                CpfCnpj = psicologoEdicaoDto.CpfCnpj,
                StatusCargo = psicologoEdicaoDto.StatusCargo,
                StatusRole = psicologoEdicaoDto.StatusRole,
                UsuarioId = psicologoFound.UsuarioId,
                Crp = psicologoEdicaoDto.Crp,
                Especialidade = psicologoEdicaoDto.Especialidade,
                ValorConsulta = psicologoEdicaoDto.ValorConsulta,
                RegenerarCredenciais = psicologoEdicaoDto.RegenerarCredenciais
            };

            await _authService.EditarPsicologo(psicologoDto);
            return Ok(psicologoDto);
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        [Authorize(Roles = "StsPsicologo")]
        [HttpPost("recepcionistas")]
        [ProducesResponseType(typeof(RecepcionistaCadastroDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(RecepcionistaCadastroDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(RecepcionistaCadastroDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CadastrarRecepcionista([FromBody] RecepcionistaCadastroDTO recepcionistaCadastroDto)
        {
            var recepcionistaDto = new RecepcionistaDTO
            {
                Nome = recepcionistaCadastroDto.Nome,
                CpfCnpj = recepcionistaCadastroDto.CpfCnpj,
                StatusCargo = recepcionistaCadastroDto.StatusCargo,
                StatusRole = recepcionistaCadastroDto.StatusRole
            };

            await _authService.CadastrarRecepcionista(recepcionistaDto);
            return Created($"/api/auth/recepcionista", recepcionistaDto);
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        [Authorize(Roles = "StsPsicologo")]
        [HttpPut("recepcionistas/{recepcionistaId}")]
        [ProducesResponseType(typeof(RecepcionistaEdicaoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(RecepcionistaEdicaoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(RecepcionistaEdicaoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(RecepcionistaEdicaoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> EditarRecepcionista(String recepcionistaId, [FromBody] RecepcionistaEdicaoDTO recepcionistaEdicaoDto)
        {
            if (recepcionistaId == null)
                return BadRequest(nameof(recepcionistaId));

            var recepcionistaFound = await _recepcionistaService.GetRecepcionistaById(recepcionistaId);
            var usuarioFound = await _authService.GetUsuarioById(recepcionistaFound.UsuarioId);

            var recepcionistaDto = new RecepcionistaDTO
            {
                Id = recepcionistaId,
                Nome = recepcionistaEdicaoDto.Nome,
                Email = usuarioFound.Email,
                Senha = recepcionistaEdicaoDto.Senha,
                CpfCnpj = recepcionistaEdicaoDto.CpfCnpj,
                StatusCargo = recepcionistaEdicaoDto.StatusCargo,
                StatusRole = recepcionistaEdicaoDto.StatusRole,
                UsuarioId = recepcionistaFound.UsuarioId,
                RegenerarCredenciais = recepcionistaEdicaoDto.RegenerarCredenciais
            };

            await _authService.EditarRecepcionista(recepcionistaDto);
            return Ok(recepcionistaDto);
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        [Authorize(Roles = "StsPsicologo")]
        [HttpDelete("recepcionistas/{recepcionistaId}")]
        [ProducesResponseType(typeof(RecepcionistaDTO), StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(RecepcionistaDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(RecepcionistaDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(RecepcionistaDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ExcluirRecepcionista(String recepcionistaId)
        {
            if (recepcionistaId == null)
                return BadRequest(nameof(recepcionistaId));

            await _authService.ExcluirRecepcionista(recepcionistaId);
            return NoContent();
        }
    }
}
