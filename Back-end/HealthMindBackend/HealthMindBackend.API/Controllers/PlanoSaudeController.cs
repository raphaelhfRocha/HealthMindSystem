using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Application.Services;
using HealthMindBackend.Domain.Enums;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthMindBackend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "StsPsicologo,StsRecepcionista")]
    public class PlanoSaudeController : ControllerBase
    {
        private readonly IPlanoSaudeService _planoSaudeService;
        
        public PlanoSaudeController(IPlanoSaudeService planoSaudeService)
        {
            _planoSaudeService = planoSaudeService;
        }

        [Authorize(Roles = "StsPsicologo,StsRecepcionista")]
        [HttpGet]
        [ProducesResponseType(typeof(PlanoSaudeDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(PlanoSaudeDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(PlanoSaudeDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllPlanosSaude()
        {
            return Ok(await _planoSaudeService.GetAllPlanosSaude());
        }

        [Authorize(Roles = "StsPsicologo")]
        [HttpPost]
        [ProducesResponseType(typeof(PlanoSaudeDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(PlanoSaudeDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(PlanoSaudeDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> RegistrarPlanoSaude([FromBody] PlanoSaudeDTO planoSaudeDto)
        {
            planoSaudeDto.StatusPlanoSaude = StatusPlanoSaudeEnum.StsAtivo;
            await _planoSaudeService.RegistrarPlanoSaude(planoSaudeDto);
            return Created($"/api/PlanoSaude", planoSaudeDto);
        }

        [Authorize(Roles = "StsPsicologo")]
        [HttpPut("{planoSaudeId}")]
        [ProducesResponseType(typeof(PlanoSaudeDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(PlanoSaudeDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(PlanoSaudeDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(PlanoSaudeDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AtualizarPlanoSaude(String planoSaudeId, PlanoSaudeDTO planoSaudeDto)
        {
            planoSaudeDto.Id = planoSaudeId;
            await _planoSaudeService.AtualizarPlanoSaude(planoSaudeDto);
            return Ok(planoSaudeDto);
        }

        [Authorize(Roles = "StsPsicologo")]
        [HttpPost("{planoSaudeId}/coberturas-plano")]
        [ProducesResponseType(typeof(CoberturaPlanoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(CoberturaPlanoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(CoberturaPlanoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(CoberturaPlanoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> RegistrarCoberturaPlano(String planoSaudeId, [FromBody] CoberturaPlanoDTO coberturaPlanoDto)
        {
            if (planoSaudeId == null)
                return BadRequest(nameof(planoSaudeId));

            await _planoSaudeService.RegistrarCoberturaPlano(planoSaudeId, coberturaPlanoDto);
            return Ok(coberturaPlanoDto);
        }

        [Authorize(Roles = "StsPsicologo")]
        [HttpPut("{planoSaudeId}/coberturas-plano/{especialidade}")]
        [ProducesResponseType(typeof(CoberturaPlanoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(CoberturaPlanoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(CoberturaPlanoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(CoberturaPlanoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AtualizarCoberturaPlano(String planoSaudeId, String especialidade, CoberturaPlanoDTO coberturaPlanoDto)
        {
            if (planoSaudeId == null)
                return BadRequest(nameof(planoSaudeId));
            if (especialidade == null)
                return BadRequest(nameof(especialidade));

            coberturaPlanoDto.Especialidade = especialidade;
            await _planoSaudeService.AtualizarCoberturaPlano(planoSaudeId, coberturaPlanoDto);
            return Ok(coberturaPlanoDto);
        }

        [Authorize(Roles = "StsPsicologo")]
        [HttpDelete("{planoSaudeId}/coberturas-plano/{especialidade}")]
        [ProducesResponseType(typeof(CoberturaPlanoDTO), StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(CoberturaPlanoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(CoberturaPlanoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(CoberturaPlanoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> RemoverCoberturaPlano(String planoSaudeId, String especialidade)
        {
            if (planoSaudeId == null)
                return BadRequest(nameof(planoSaudeId));
            if (especialidade == null)
                return BadRequest(nameof(especialidade));

            await _planoSaudeService.RemoverCoberturaPlano(planoSaudeId, especialidade);
            return NoContent();
        }
    }
}