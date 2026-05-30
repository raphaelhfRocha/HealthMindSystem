using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Application.Services;
using HealthMindBackend.Domain.Validations;
using Microsoft.AspNetCore.Mvc;

namespace HealthMindBackend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PsicologoController : ControllerBase
    {
        private readonly IPsicologoService _psicologoService;

        public PsicologoController(IPsicologoService psicologoService)
        {
            _psicologoService = psicologoService;
        }

        /// <summary>
        /// Lista de todos os psicólogos
        /// </summary>
        /// <response code="200">Psicólogos encontrados</response>
        /// <response code="404">Psicólogos não encontrados</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a listagem de todos psicólogos**
        /// 
        /// Como usar:
        /// 
        /// **1. Clique no botão Try it out na sessão de Parameters(Parâmetros)**
        ///
        /// **2. Em seguida clique no botão Execute**
        /// </remarks>

        [HttpGet]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllPsicologos()
        {
            return Ok(await _psicologoService.GetAllPsicologos());
        }

        /// <summary>
        /// Lista de psicólogos por nome
        /// </summary>
        /// <response code="200">Psicólogos encontrados</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="404">Psicólogos não encontrados</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a lista de Psicólogos por nome**
        /// 
        /// Como usar:
        /// 
        /// **1. Digite o Nome do psicólogo registrado no campo do parâmetro nome**
        /// 
        /// **2. Em seguida clique no botão Execute**
        /// 
        /// **[GET] - /api/Psicologo/nome/{nome}**
        /// </remarks>
        /// <param name="nome">
        /// Nome
        /// </param>
        [HttpGet("nome/{nome}")]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetPsicologosByNome(String nome)
        {
            if (nome == null)
                return BadRequest(nameof(nome));

            return Ok(await _psicologoService.GetPsicologosByNome(nome));
        }

        /// <summary>
        /// Lista de psicólogos por especialidade
        /// </summary>
        /// <response code="200">Psicólogos encontrados</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="404">Psicólogos não encontrados</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a lista de Psicólogos por especialidade**
        /// 
        /// Como usar:
        /// 
        /// **1. Digite a Especialidade do psicólogo registrado no campo do parâmetro especialidade**
        /// 
        /// **2. Em seguida clique no botão Execute**
        /// 
        /// **[GET] - /api/Psicologo/especialidade/{especialidade}**
        /// </remarks>
        /// <param name="especialidade">
        /// Especialidade
        /// </param>
        [HttpGet("especialidade/{especialidade}")]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetPsicologosByEspecialidade(String especialidade)
        {
            if (especialidade == null)
                return BadRequest(nameof(especialidade));

            return Ok(await _psicologoService.GetPsicologosByEspecialidade(especialidade));
        }

        /// <summary>
        /// Lista de disponbilidades por Id psicólogo
        /// </summary>
        /// <response code="200">Disponibilidades encontradas</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="404">Disponibilidades não encontradas</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a lista de Disponibilidades por Id psicólogo**
        /// 
        /// Como usar:
        /// 
        /// **1. Digite o Id do psicólogo registrado no campo do parâmetro psicologoId**
        /// 
        /// **2. Em seguida clique no botão Execute**
        /// 
        /// **[GET] - /api/Psicologo/{psicologoId}/disponibilidades**
        /// </remarks>
        /// <param name="psicologoId">
        /// ID Psicólogo
        /// </param>
        [HttpGet("{psicologoId}/disponibilidades")]
        [ProducesResponseType(typeof(DisponibilidadeDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(DisponibilidadeDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(DisponibilidadeDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(DisponibilidadeDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetDisponibilidadesByPsicologoId(String psicologoId)
        {
            if (psicologoId == null)
                return BadRequest(nameof(psicologoId));

            return Ok(await _psicologoService.GetDisponibilidadesByPsicologoId(psicologoId));
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
        [HttpPost]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CadastrarPsicologo([FromBody] PsicologoDTO psicologoDto)
        {
            await _psicologoService.CadastrarPsicologo(psicologoDto);
            return Created($"/api/psicologo", psicologoDto);
        }

        /// <summary>
        /// Edição de psicólogo
        /// </summary>
        /// <response code="200">Psicólogo editado</response>
        /// <response code="400">Erro ao enviar dados - Bad Request</response>
        /// <response code="404">Psicólogo não encontrado</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a edição de psicólogo**
        /// 
        /// 
        /// Como usar:
        /// 
        /// **1. Digite o Id do psicologo registrado no campo do parâmetro psicologoId**
        /// **2. Digite os dados que deseja editar seguindo o modelo abaixo:**
        /// 
        /// **[PUT] - /api/Psicologo/{psicologoId}**
        /// ```
        /// {
        ///   "Nome": "Nome do psicólogo",
        ///   "Email": "email@email.com",
        ///   "CpfCnpj": "12345678903",
        ///   "StatusCargo": 1,
        ///   "StatusRole": 2,
        ///   "Crp": "123456789",
        ///   "Especialidade": "Especialidade",
        ///   "disponibilidadesDTO": [
        ///   { // Nova disponibilidade
        ///     "dataDisponibilidade": "0000-00-00T00:00:00.000Z",
        ///     "horaInicio": "00:00:00",
        ///     "statusDisponibilidade": 1
        ///   }
        ///  ]
        /// }
        /// ```
        /// **3. Em seguida clique no botão Execute na sessão Request Body(Corpo da requisição) para enviar os dados**
        /// </remarks>
        /// <param name="psicologoId">
        /// ID Psicólogo
        /// </param>
        [HttpPut("{psicologoId}")]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(PsicologoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> EditarPsicologo(String psicologoId, [FromBody] PsicologoDTO psicologoDto)
        {
            if (psicologoId == null)
                return BadRequest(nameof(psicologoId));

            psicologoDto.Id = psicologoId;
            await _psicologoService.AtualizarPsicologo(psicologoDto);

            if (psicologoDto.DisponibilidadesDTO != null)
            {
                foreach (var item in psicologoDto.DisponibilidadesDTO)
                {
                    item.PsicologoId = psicologoId;
                    await _psicologoService.AdicionarDisponibilidade(item);
                }
            }
            return Ok(psicologoDto);
        }
        /// <summary>
        /// Exclusão de disponibilidade de psicologo.
        /// </summary>
        /// <param name="psicologoId">Id Psicologo</param>
        /// <param name="disponibilidadeId">Id Disponibilidade</param>
        /// <response code="204">Disponibilidade excluída</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="404">Dados não encontrados</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a exclusão de disponibilidade de psicologo**
        /// 
        /// Como usar:
        /// 
        /// **1. Clique no botão Try it out na sessão de Parameters(Parâmetros)**
        /// 
        /// **2. Digite os parametros de disponibilidade e psicologo nos campos de Id de Disponibilidade e Id do Psicologo**
        /// 
        /// **3. Em seguida clique no botão Execute**
        /// 
        /// </remarks>
        [HttpDelete("{psicologoId}/disponibilidades/{disponibilidadeId}")]
        [ProducesResponseType(typeof(DisponibilidadeDTO), StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(DisponibilidadeDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(DisponibilidadeDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(DisponibilidadeDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ExcluirDisponibilidade(String psicologoId, String disponibilidadeId)
        {
            if (psicologoId == null)
                return BadRequest(nameof(psicologoId));
            if (disponibilidadeId == null)
                return BadRequest(nameof(disponibilidadeId));
            
            await _psicologoService.ExcluirDisponibilidade(psicologoId, disponibilidadeId);
            return NoContent();
        }
    }
}
