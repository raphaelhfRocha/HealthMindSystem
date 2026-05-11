using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Application.Services;
using HealthMindBackend.Domain.Validations;
using Microsoft.AspNetCore.Mvc;

namespace HealthMindBackend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProgressaoController : ControllerBase
    {
        private readonly IProgressaoService _progressaoService;

        public ProgressaoController(IProgressaoService progressaoService)
        {
            _progressaoService = progressaoService;            
        }

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
