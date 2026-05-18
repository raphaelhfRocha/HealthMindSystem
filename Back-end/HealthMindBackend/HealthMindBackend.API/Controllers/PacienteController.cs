using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Domain.Validations;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthMindBackend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class PacienteController : ControllerBase
    {
        private readonly IPacienteService _pacienteService;

        public PacienteController(IPacienteService pacienteService)
        {
            _pacienteService = pacienteService;
        }

        /// <summary>
        /// Lista de todos os pacientes
        /// </summary>
        /// <response code="200">Pacientes encontrados</response>
        /// <response code="404">Pacientes não encontrados</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a listagem de todos pacientes**
        /// 
        /// Como usar:
        /// 
        /// **1. Clique no botão Try it out na sessão de Parameters(Parâmetros)**
        ///
        /// **2. Em seguida clique no botão Execute**
        /// 
        /// **[GET] - /api/Paciente**
        /// </remarks>
        [Authorize(Roles = "Recepcionista")]
        [HttpGet]
        [ProducesResponseType(typeof(PacienteDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(PacienteDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(PacienteDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllPacientes()
        {
            return Ok(await _pacienteService.GetAllPacientes());
        }

        /// <summary>
        /// Lista de pacientes por Id Psicologo
        /// </summary>
        /// <response code="200">Pacientes encontrados</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="404">Pacientes não encontrados</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a lista de pacientes por Id Psicologo**
        /// 
        /// Como usar:
        /// 
        /// **1. Digite o Id do psicologo registrado no campo do parâmetro psicologoId**
        /// 
        /// **2. Em seguida clique no botão Execute**
        /// 
        /// **[GET] - /api/Paciente/psicologo/{psicologoId}**
        /// </remarks>
        /// <param name="psicologoId">
        /// ID Psicólogo
        /// </param>
        [Authorize(Roles = "StsPsicologo")]
        [HttpGet("psicologo/{psicologoId}")]
        [ProducesResponseType(typeof(PacienteDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(PacienteDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(PacienteDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(PacienteDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetPacientesByPsicologoId(String? psicologoId)
        {
            return Ok(await _pacienteService.GetPacientesByPsicologoId(psicologoId));
        }

        /// <summary>
        /// Cadastro de pacientes
        /// </summary>
        /// <response code="201">Paciente cadastrado</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a cadastro de pacientes**
        /// 
        /// Como usar:
        /// 
        /// **1. Clique no botão Try it out na sessão de Parameters(Parâmetros)**
        /// 
        /// **2. Digite os dados na sessão Request Body(Corpo da requisição) que deseja cadastrar seguindo o modelo abaixo:**
        /// **[POST] - /api/Paciente**
        /// ```
        /// {
        ///   "nome": "Nome do paciente",
        ///   "email": "E-mail do paciente",
        ///   "cpfCnpj": "323043023203",
        ///   "dataNascimento": "0000-00-00T00:00:00.000Z",
        ///   "psicologoId": "Id do psicólogo"
        /// }
        /// ```
        /// **3. Em seguida clique no botão Execute na sessão Request Body(Corpo da requisição) para enviar os dados**
        /// </remarks>
        /// <param name="pacienteDto">
        ///     **Dados a cadastrar**
        /// </param>
        [Authorize(Roles = "Recepcionista")]
        [HttpPost]
        [ProducesResponseType(typeof(PacienteDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(PacienteDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(PacienteDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CadastrarPaciente([FromBody] PacienteDTO pacienteDto)
        {
            await _pacienteService.CadastrarPaciente(pacienteDto);
            return Created($"/api/paciente", pacienteDto);
        }


        /// <summary>
        /// Edição de paciente
        /// </summary>
        /// <response code="200">Paciente editado</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="404">Paciente não encontrado</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a edição de paciente**
        /// 
        /// 
        /// Como usar:
        /// 
        /// **1. Digite o Id do paciente registrado no campo do parâmetro pacienteId**
        /// 
        /// **2. Digite os dados que deseja editar seguindo o modelo abaixo:**
        /// 
        /// **[PUT] - /api/Paciente/{pacienteId}**
        /// ```
        /// {
        ///   "nome": "Nome do paciente",
        ///   "email": "E-mail do paciente",
        ///   "cpfCnpj": "323043023203",
        ///   "dataNascimento": "0000-00-00T00:00:00.000Z",
        ///   "psicologoId": "Id do psicólogo"
        /// }
        /// ```
        /// **3. Em seguida clique no botão Execute na sessão Request Body(Corpo da requisição) para enviar os dados**
        /// </remarks>
        /// <param name="pacienteId">
        /// ID Paciente
        /// </param>
        /// <param name="pacienteDto">
        /// Dados a alterar
        /// </param>
        [Authorize(Roles = "Recepcionista")]
        [HttpPut("{pacienteId}")]
        [ProducesResponseType(typeof(PacienteDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(PacienteDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(PacienteDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(PacienteDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> EditarPaciente(String pacienteId, [FromBody] PacienteDTO pacienteDto)
        {
            if (pacienteId == null)
                return BadRequest(nameof(pacienteId));
            
            pacienteDto.Id = pacienteId;
            await _pacienteService.AtualizarPaciente(pacienteDto);
            return Ok(pacienteDto);
        }
    }
}
