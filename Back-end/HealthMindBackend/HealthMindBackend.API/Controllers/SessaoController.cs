using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Application.Services;
using HealthMindBackend.Domain.Validations;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthMindBackend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class SessaoController : ControllerBase
    {
        private readonly ISessaoService _sessaoService;

        public SessaoController(ISessaoService sessaoService)
        {
            _sessaoService = sessaoService;
        }


        /// <summary>
        /// Lista de todas as sessões
        /// </summary>
        /// <response code="200">Sessões encontradas</response>
        /// <response code="404">Sessões não encontradas</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a listagem de todas sessões**
        /// 
        /// Como usar:
        /// 
        /// **1. Clique no botão Try it out na sessão de Parameters(Parâmetros)**
        ///
        /// **2. Em seguida clique no botão Execute**
        /// 
        /// **[GET] - /api/Sessao**
        /// </remarks>
        [Authorize(Roles = "StsPsicologo,StsRecepcionista")]
        [HttpGet]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllSessoes()
        {
            var result = await _sessaoService.GetAllSessoes();
            return Ok(result);
        }

        /// <summary>
        /// Lista de sessões por Id Paciente
        /// </summary>
        /// <response code="200">Sessões encontrados</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="404">Sessões não encontrados</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a lista de sessões por Id Paciente**
        /// 
        /// Como usar:
        /// 
        /// **1. Digite o Id do prontuário registrado no campo do parâmetro pacienteId**
        /// 
        /// **2. Em seguida clique no botão Execute**
        /// 
        /// **[GET] - /api/Sessao/paciente/{pacienteId}**
        /// </remarks>
        /// <param name="pacienteId">
        /// ID Paciente.
        /// </param>
        [Authorize(Roles = "StsPsicologo,StsRecepcionista")]
        [HttpGet("paciente/{pacienteId}")]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetSessoesByPacienteId(String pacienteId)
        {
            if (pacienteId == null)
                return BadRequest(nameof(pacienteId));

            var result = await _sessaoService.GetSessoesByPacienteId(pacienteId);
            return Ok(result);
        }

        /// <summary>
        /// Lista de sessões por Id Psicólogo
        /// </summary>
        /// <response code="200">Sessões encontrados</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="404">Sessões não encontrados</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a lista de sessões por Id Psicólogo**
        /// 
        /// Como usar:
        /// 
        /// **1. Digite o Id do prontuário registrado no campo do parâmetro psicologoId**
        /// 
        /// **2. Em seguida clique no botão Execute**
        /// 
        /// **[GET] - /api/Sessao/psicologo/{psicologoId}**
        /// </remarks>
        /// <param name="psicologoId">
        /// ID Prontuário.
        /// </param>
        [Authorize(Roles = "StsPsicologo")]
        [HttpGet("psicologo/{psicologoId}")]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetSessoesByPsicologoId(String psicologoId)
        {
            if (psicologoId == null)
                return BadRequest(nameof(psicologoId));

            var result = await _sessaoService.GetSessoesByPsicologoId(psicologoId);
            return Ok(result);
        }

        /// <summary>
        /// Lista de sessões por Id Sessão
        /// </summary>
        /// <response code="200">Sessão encontrados</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="404">Sessão não encontrados</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a lista de sessão por Id Sessão**
        /// 
        /// Como usar:
        /// 
        /// **1. Digite o Id do prontuário registrado no campo do parâmetro sessaoId**
        /// 
        /// **2. Em seguida clique no botão Execute**
        /// 
        /// **[GET] - /api/Sessao/{sessaoId}**
        /// </remarks>
        /// <param name="sessaoId">
        /// ID Sessão
        /// </param>
        [Authorize(Roles = "StsPsicologo,StsRecepcionista")]
        [HttpGet("{sessaoId}")]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetSessaoById(String sessaoId)
        {
            if (sessaoId == null)
                return BadRequest(nameof(sessaoId));

            var result = await _sessaoService.GetSessaoById(sessaoId);
            return Ok(result);
        }


        /// <summary>
        /// Agendamento de sessão
        /// </summary>
        /// <response code="201">Sessão agendada</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a agendamento de sessões**
        /// 
        /// Como usar:
        /// 
        /// **1. Clique no botão Try it out na sessão de Parameters(Parâmetros)**
        /// 
        /// **2. Digite os dados na sessão Request Body(Corpo da requisição) que deseja cadastrar seguindo o modelo abaixo:**
        /// 
        /// **[POST] - /api/Sessao**
        /// ```
        /// {
        ///   "pacienteId": "Id do paciente",
        ///   "psicologoId": "Id do psicólogo",
        ///   "dataSessao": "0000-00-00T00:00:00.000Z",
        ///   "horaInicio": "Horario de início",
        ///   "observacoes": "Observações",
        ///   "statusTipoAtendimento": 0,
        ///   "pagamentoDTO": {
        ///     "valor": 0,
        ///     "dataPagamento": "0000-00-00T00:00:00.000Z",
        ///     "formaPagamento": 0,
        ///     "statusPagamento": 0,
        ///     "statusParcelado": 0,
        ///     "totalParcelas": 0
        ///   },
        ///   "statusSessao": 0
        /// }
        /// ```
        /// **3. Em seguida clique no botão Execute na sessão Request Body(Corpo da requisição) para enviar os dados**
        /// </remarks>
        /// <param name="sessaoDto">
        ///     **Dados a cadastrar**
        /// </param>
        [Authorize(Roles = "StsRecepcionista")]
        [HttpPost]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AgendarSessao([FromBody] SessaoDTO sessaoDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _sessaoService.AgendarSessao(sessaoDto);
            return CreatedAtAction(nameof(GetSessaoById),
                new { sessaoId = result.Id }, result);
        }

        [Authorize(Roles = "StsPsicologo")]
        [HttpPost("{sessaoId}/registros-sessoes")]
        [ProducesResponseType(typeof(RegistroSessaoDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(RegistroSessaoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(RegistroSessaoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AdicionarRegistroSessao(String sessaoId, [FromBody] RegistroSessaoDTO registroSessaoDto)
        {
            if (sessaoId == null)
                return BadRequest(nameof(sessaoId));

            registroSessaoDto.SessaoId = sessaoId;
            await _sessaoService.AdicionarRegistroSessao(registroSessaoDto);
            return Created($"/api/Sessao/{sessaoId}/registro-sessao", registroSessaoDto);
        }
        [Authorize(Roles = "StsPsicologo")]
        [HttpPost("{sessaoId}/escalas-sessoes")]
        [ProducesResponseType(typeof(EscalaSessaoDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(EscalaSessaoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(EscalaSessaoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AdicionarEscalaSessao(String sessaoId, [FromBody] EscalaSessaoDTO escalaSessaoDto)
        {
            if (sessaoId == null)
                return BadRequest(nameof(sessaoId));

            escalaSessaoDto.SessaoId = sessaoId;
            await _sessaoService.AdicionarEscalaSessao(escalaSessaoDto);
            return Created($"/api/Sessao/{sessaoId}/escala-sessao", escalaSessaoDto);
        }
        /// <summary>
        /// Alteração de Sessão
        /// </summary>
        /// <response code="200">Sessão alterada</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="404">Sessão não encontrado</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a alteração de Sessão**
        /// 
        /// 
        /// Como usar:
        /// 
        /// **1. Digite o Id da sessão registrado no campo do parâmetro sessaoId**
        /// 
        /// **2. Digite os dados que deseja editar seguindo o modelo abaixo:**
        /// 
        /// **[PUT] - /api/Sessao/{sessaoId}**
        /// ```
        /// {
        ///   "pacienteId": "Id do paciente",
        ///   "psicologoId": "Id do psicólogo",
        ///   "dataSessao": "0000-00-00T00:00:00.000Z",
        ///   "horaInicio": "Horario de início",
        ///   "observacoes": "Observações",
        ///   "statusTipoAtendimento": 0,
        ///   "pagamentoDTO": {
        ///     "valor": 0,
        ///     "dataPagamento": "0000-00-00T00:00:00.000Z",
        ///     "formaPagamento": 0,
        ///     "statusPagamento": 0,
        ///     "statusParcelado": 0,
        ///     "totalParcelas": 0
        ///   },
        ///   "statusSessao": 0
        /// }
        /// ```
        /// **3. Em seguida clique no botão Execute na sessão Request Body(Corpo da requisição) para enviar os dados**
        /// </remarks>
        /// <param name="sessaoId">
        /// ID Sessão
        /// </param>
        /// <param name="sessaoDto">
        /// Dados a alterar
        /// </param>
        [Authorize(Roles = "StsRecepcionista")]
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

            sessaoDto.Id = sessaoId;
            await _sessaoService.AlterarSessao(sessaoDto);
            return Ok(sessaoDto);
        }

        /// <summary>
        /// Alteração de Pagamento
        /// </summary>
        /// <response code="200">Pagamento alterado</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="404">Sessão/Pagamento não encontrado</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a alteração de Pagamento**
        /// 
        /// 
        /// Como usar:
        /// 
        /// **1. Digite o Id da sessão registrado no campo do parâmetro sessaoId**
        /// 
        /// **2. Digite os dados que deseja editar seguindo o modelo abaixo:**
        /// 
        /// **[PUT] - /api/Sessao/pagamento/{sessaoId}**
        /// ```
        /// {
        ///   "valor": 0,
        ///   "dataPagamento": "0000-00-00T00:00:00.000Z",
        ///   "formaPagamento": 0,
        ///   "statusPagamento": 0,
        ///   "statusParcelado": 0,
        ///   "totalParcelas": 0
        /// }
        /// ```
        /// **3. Em seguida clique no botão Execute na sessão Request Body(Corpo da requisição) para enviar os dados**
        /// </remarks>
        /// <param name="sessaoId">
        /// ID Sessão
        /// </param>
        /// <param name="pagamentoDto">
        /// Dados a alterar
        /// </param>
        [Authorize(Roles = "StsRecepcionista")]
        [HttpPut("pagamento/{sessaoId}")]
        [ProducesResponseType(typeof(PagamentoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(PagamentoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(PagamentoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(PagamentoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AlterarPagamento(String sessaoId, [FromBody] PagamentoDTO pagamentoDto)
        {
            if (sessaoId == null)
                return BadRequest(nameof(sessaoId));

            pagamentoDto.SessaoId = sessaoId;
            await _sessaoService.DefinirPagamento(pagamentoDto);
            return Ok(pagamentoDto);
        }

        [Authorize(Roles = "StsPsicologo")]
        [HttpPut("{sessaoId}/registros-sessoes/{registroSessaoId}")]
        [ProducesResponseType(typeof(RegistroSessaoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(RegistroSessaoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(RegistroSessaoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(RegistroSessaoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AlterarRegistroSessao(String registroSessaoId, String sessaoId, [FromBody] RegistroSessaoDTO registroSessaoDto)
        {
            if (registroSessaoId == null)
                return BadRequest(nameof(registroSessaoId));
            if (sessaoId == null)
                return BadRequest(nameof(sessaoId));

            registroSessaoDto.Id = registroSessaoId;
            registroSessaoDto.SessaoId = sessaoId;
            await _sessaoService.AlterarRegistroSessao(registroSessaoDto);
            return Ok(registroSessaoDto);
        }

        [Authorize(Roles = "StsPsicologo")]
        [HttpDelete("{sessaoId}/registros-sessoes/{registroSessaoId}")]
        [ProducesResponseType(typeof(RegistroSessaoDTO), StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(RegistroSessaoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(RegistroSessaoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(RegistroSessaoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ExcluirRegistroSessao(String sessaoId, String registroSessaoId)
        {
            if (sessaoId == null)
                return BadRequest(nameof(sessaoId));
            if (registroSessaoId == null)
                return BadRequest(nameof(registroSessaoId));

            await _sessaoService.ExcluirRegistroSessao(sessaoId, registroSessaoId);
            return NoContent();
        }

        [Authorize(Roles = "StsPsicologo")]
        [HttpPut("{sessaoId}/escalas-sessoes/{escalaSessaoId}")]
        [ProducesResponseType(typeof(EscalaSessaoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(EscalaSessaoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(EscalaSessaoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(EscalaSessaoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AlterarEscalaSessao(String escalaSessaoId, String sessaoId, [FromBody] EscalaSessaoDTO escalaSessaoDto)
        {
            if (escalaSessaoId == null)
                return BadRequest(nameof(escalaSessaoId));
            if (sessaoId == null)
                return BadRequest(nameof(sessaoId));

            escalaSessaoDto.Id = escalaSessaoId;
            escalaSessaoDto.SessaoId = sessaoId;
            await _sessaoService.AlterarEscalaSessao(escalaSessaoDto);
            return Ok(escalaSessaoDto);
        }

        [Authorize(Roles = "StsPsicologo")]
        [HttpDelete("{sessaoId}/escalas-sessoes/{escalaSessaoId}")]
        [ProducesResponseType(typeof(EscalaSessaoDTO), StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(EscalaSessaoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(EscalaSessaoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(EscalaSessaoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ExcluirEscalaSessao(String escalaSessaoId, String sessaoId)
        {
            if (sessaoId == null)
                return BadRequest(nameof(sessaoId));
            if (escalaSessaoId == null)
                return BadRequest(nameof(escalaSessaoId));

            await _sessaoService.ExcluirEscalaSessao(sessaoId, escalaSessaoId);
            return NoContent();
        }

        /// <summary>
        /// Exclusão de sessão.
        /// </summary>
        /// <response code="204">Sessão excluída</response>
        /// <response code="400">Dado inválido</response>
        /// <response code="404">Dado não encontrado</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a exclusão de sessão**
        /// 
        /// Como usar:
        /// 
        /// **1. Clique no botão Try it out na sessão de Parameters(Parâmetros)**
        /// 
        /// **2. Digite o parâmetro de sessão no campo de Id da Sessão**
        /// 
        /// **3. Em seguida clique no botão Execute**
        /// 
        /// **[DELETE] - /api/Sessao/{sessaoId}**
        /// 
        /// </remarks>
        /// <param name="sessaoId">ID Sessão</param>
        [Authorize(Roles = "StsRecepcionista")]
        [HttpDelete("{sessaoId}")]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(SessaoDTO), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ExcluirSessao(String sessaoId)
        {
            if (sessaoId == null)
                return BadRequest(nameof(sessaoId));

            await _sessaoService.ExcluirSessao(sessaoId);
            return NoContent();
        }
    }
}
