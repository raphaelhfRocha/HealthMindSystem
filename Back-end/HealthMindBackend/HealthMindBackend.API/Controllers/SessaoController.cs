using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Application.Services;
using HealthMindBackend.Domain.Validations;
using Microsoft.AspNetCore.Mvc;

namespace HealthMindBackend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SessaoController : ControllerBase
    {
        private readonly ISessaoService _sessaoService;

        public SessaoController(ISessaoService sessaoService)
        {
            _sessaoService = sessaoService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllSessoes()
        {
            try
            {
                var result = await _sessaoService.GetAllSessoes();
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

        [HttpGet("psicologo/{psicologoId}")]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetSessoesByPsicologoId(String psicologoId)
        {
            if (psicologoId == null)
                return BadRequest(nameof(psicologoId));
            try
            {
                var result = await _sessaoService.GetSessoesByPsicologoId(psicologoId);
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

        [HttpGet("{sessaoId}")]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetSessaoById(String sessaoId)
        {
            if (sessaoId == null)
                return BadRequest(nameof(sessaoId));
            try
            {
                var result = await _sessaoService.GetSessaoById(sessaoId);
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

        [HttpPost]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AgendarSessao([FromBody] SessaoDTO sessaoDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                var result = await _sessaoService.AgendarSessao(sessaoDto);
                return CreatedAtAction(nameof(GetSessaoById),
                    new { sessaoId = result.Id }, result);
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

        [HttpPut("{sessaoId}")]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AlterarSessao(String sessaoId, [FromBody] SessaoDTO sessaoDto)
        {
            if (sessaoId == null)
                return BadRequest(nameof(sessaoId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                sessaoDto.Id = sessaoId;
                await _sessaoService.AlterarSessao(sessaoDto);
                return Ok(sessaoDto);
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



        [HttpDelete("{sessaoId}")]
        [ProducesResponseType(typeof(PagamentoDTO), StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(PagamentoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(PagamentoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(PagamentoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ExcluirPagamento(String sessaoId)
        {
            if (sessaoId == null)
                return BadRequest(nameof(sessaoId));
            try
            {
                await _sessaoService.ExcluirPagamento(sessaoId);
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
