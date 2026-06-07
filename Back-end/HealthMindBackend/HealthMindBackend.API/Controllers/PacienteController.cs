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
        /// <response code="404">Pacientes n√£o encontrados</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint √© dedicado a listagem de todos pacientes**
        /// 
        /// Como usar:
        /// 
        /// **1. Clique no bot√£o Try it out na sess√£o de Parameters(Par√¢metros)**
        ///
        /// **2. Em seguida clique no bot√£o Execute**
        /// 
        /// **[GET] - /api/Paciente**
        /// </remarks>
        [Authorize(Roles = "StsPsicologo, StsRecepcionista")]
        [HttpGet]
        [ProducesResponseType(typeof(PacienteDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(PacienteDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(PacienteDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllPacientes()
        {
            return Ok(await _pacienteService.GetAllPacientes());
        }

        /// <summary>
        /// Obter paciente por Id
        /// </summary>
        /// <response code="200">Paciente encontrado</response>
        /// <response code="400">Dados inv·lido</response>
        /// <response code="404">Paciente n„o encontrado</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint √© dedicado a obter paciente por Id**
        /// 
        /// Como usar:
        /// 
        /// **1. Digite o Id do paciente registrado no campo do par√¢metro Id**
        /// 
        /// **2. Em seguida clique no bot√£o Execute**
        /// 
        /// **[GET] - /api/Paciente/{id}**
        /// </remarks>
        /// <param name="id">
        /// ID Paciente
        /// </param>
        [Authorize(Roles = "StsRecepcionista")]
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(PacienteDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(PacienteDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(PacienteDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(PacienteDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetPacienteById(String id)
        {
            if (id == null)
                return BadRequest(nameof(id));

            return Ok(await _pacienteService.GetPacienteById(id));
        }

        /// <summary>
        /// Lista de pacientes por Nome
        /// </summary>
        /// <response code="200">Pacientes encontrados</response>
        /// <response code="400">Dados inv√°lidos</response>
        /// <response code="404">Pacientes n√£o encontrados</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint È dedicado a lista de pacientes por Nome**
        /// 
        /// Como usar:
        /// 
        /// **1. Digite o nome dos pacientes registrados no campo do par√¢metro nome**
        /// 
        /// **2. Em seguida clique no bot„o Execute**
        /// 
        /// **[GET] - /api/Paciente/nome/{nome}**
        /// </remarks>
        /// <param name="nome">
        /// Nome paciente
        /// </param>
        [Authorize(Roles = "StsRecepcionista")]
        [HttpGet("nome/{nome}")]
        [ProducesResponseType(typeof(PacienteDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(PacienteDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(PacienteDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(PacienteDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetPacientesByNome(String nome)
        {
            if (nome == null)
                return BadRequest(nameof(nome));

            return Ok(await _pacienteService.GetPacientesByNome(nome));
        }
        /// <summary>
        /// Lista de pacientes por Id Psicologo
        /// </summary>
        /// <response code="200">Pacientes encontrados</response>
        /// <response code="400">Dados inv√°lidos</response>
        /// <response code="404">Pacientes n√£o encontrados</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint È dedicado a lista de pacientes por Id Psicologo**
        /// 
        /// Como usar:
        /// 
        /// **1. Digite o Id do psicologo registrado no campo do par‚metro psicologoId**
        /// 
        /// **2. Em seguida clique no bot„o Execute**
        /// 
        /// **[GET] - /api/Paciente/psicologo/{psicologoId}**
        /// </remarks>
        /// <param name="psicologoId">
        /// ID PsicÛlogo
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
        /// <response code="400">Dados inv√°lidos</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint È dedicado a cadastro de pacientes**
        /// 
        /// Como usar:
        /// 
        /// **1. Clique no bot„o Try it out na sess„o de Parameters(Par‚metros)**
        /// 
        /// **2. Digite os dados na sess„o Request Body(Corpo da requisiÁ„o) que deseja cadastrar seguindo o modelo abaixo:**
        /// **[POST] - /api/Paciente**
        /// ```
        /// {
        ///   "nome": "Nome do paciente",
        ///   "email": "E-mail do paciente",
        ///   "cpfCnpj": "323043023203",
        ///   "dataNascimento": "0000-00-00T00:00:00.000Z",
        ///   "psicologoId": "Id do psic√≥logo"
        /// }
        /// ```
        /// **3. Em seguida clique no bot√£o Execute na sess√£o Request Body(Corpo da requisi√ß√£o) para enviar os dados**
        /// </remarks>
        /// <param name="pacienteDto">
        ///     **Dados a cadastrar**
        /// </param>
        [Authorize(Roles = "StsRecepcionista")]
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
        /// EdiÁ„o de paciente
        /// </summary>
        /// <response code="200">Paciente editado</response>
        /// <response code="400">Dados inv√°lidos</response>
        /// <response code="404">Paciente n√£o encontrado</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// Esse endpoint È dedicado a ediÁ„o de paciente**
        /// 
        /// 
        /// Como usar:
        /// 
        /// **1. Digite o Id do paciente registrado no campo do par√¢metro pacienteId**
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
        ///   "psicologoId": "Id do psic√≥logo"
        /// }
        /// ```
        /// **3. Em seguida clique no bot√£o Execute na sess√£o Request Body(Corpo da requisi√ß√£o) para enviar os dados**
        /// </remarks>
        /// <param name="pacienteId">
        /// ID Paciente
        /// </param>
        /// <param name="pacienteDto">
        /// Dados a alterar
        /// </param>
        [Authorize(Roles = "StsRecepcionista")]
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
