using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Application.Services;
using HealthMindBackend.Domain.Validations;
using Microsoft.AspNetCore.Mvc;

namespace HealthMindBackend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DiagnosticoController : ControllerBase
    {
        private readonly IDiagnosticoService _diagnosticoService;

        public DiagnosticoController(IDiagnosticoService diagnosticoService)
        {
            _diagnosticoService = diagnosticoService;
        }

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
