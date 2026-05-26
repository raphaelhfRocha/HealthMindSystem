using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace HealthMindBackend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlanoSaudeController : ControllerBase
    {
        private readonly IPlanoSaudeService _planoSaudeService;
        
        public PlanoSaudeController(IPlanoSaudeService planoSaudeService)
        {
            _planoSaudeService = planoSaudeService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(PlanoSaudeDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(PlanoSaudeDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(PlanoSaudeDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllPlanosSaude()
        {
            return Ok(await _planoSaudeService.GetAllPlanosSaude());
        }

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
    }
}