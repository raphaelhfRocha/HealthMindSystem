using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Domain.Validations;
using Microsoft.AspNetCore.Mvc;

namespace HealthMindBackend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HistoricoMedicoController : ControllerBase
    {
        private readonly IHistoricoMedicoService _historicoMedicoService;

        public HistoricoMedicoController(IHistoricoMedicoService historicoMedicoService)
        {
            _historicoMedicoService = historicoMedicoService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllHistoricosMedicos()
        {
            try
            {
                var result = await _historicoMedicoService.GetAllHistoricoMedicos();
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
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetHistoricosMedicosByProntuarioId(String prontuarioId)
        {
            if (prontuarioId == null)
                return BadRequest(nameof(prontuarioId));
            try
            {
                var result = await _historicoMedicoService.GetHistoricosByProntuarioId(prontuarioId);
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
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> RegistrarHistoricoMedico([FromBody] HistoricoMedicoDTO historicoMedicoDto)
        {
            if (historicoMedicoDto == null)
                return BadRequest(nameof(historicoMedicoDto));
            try
            {
                await _historicoMedicoService.AdicionarHistoricoMedico(historicoMedicoDto);
                return Created($"/api/historicoMedico", historicoMedicoDto);
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

        [HttpPut("{historicoId}")]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> EditarHistoricoMedico(String historicoId, [FromBody] HistoricoMedicoDTO historicoMedicoDto)
        {
            if(historicoId == null)
                return BadRequest(nameof(historicoId));
            try
            {
                historicoMedicoDto.Id = historicoId;
                await _historicoMedicoService.AtualizarHistoricoMedico(historicoMedicoDto);
                return Ok(historicoMedicoDto);
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

        [HttpDelete("{historicoId}")]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(HistoricoMedicoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ExcluirHistoricoMedico(String historicoId)
        {
            if (historicoId == null)
                return BadRequest(nameof(historicoId));
            try
            {
                await _historicoMedicoService.ExcluirHistoricoMedico(historicoId);
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
