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
        [Authorize(Roles = "Recepcionista")]
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
        [Authorize(Roles = "Psicologo")]
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
        [Authorize(Roles = "Recepcionista")]
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
        [Authorize(Roles = "Recepcionista")]
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
        [Authorize(Roles = "Recepcionista")]
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


        /// <summary>
        /// Exclusão de pagamento da sessão.
        /// </summary>
        /// <response code="204">Pagamento excluído</response>
        /// <response code="400">Dado inválido</response>
        /// <response code="404">Dado não encontrado</response>
        /// <response code="500">Erro interno</response>
        /// <remarks>
        /// **Esse endpoint é dedicado a exclusão de pagamento da sessão**
        /// 
        /// Como usar:
        /// 
        /// **1. Clique no botão Try it out na sessão de Parameters(Parâmetros)**
        /// 
        /// **2. Digite o parâmetro de pagamento no campo de Id da Sessão**
        /// 
        /// **3. Em seguida clique no botão Execute**
        /// 
        /// **[DELETE] - /api/Sessao/{sessaoId}**
        /// 
        /// </remarks>
        /// <param name="sessaoId">ID Sessão</param>
        [Authorize(Roles = "Recepcionista")]
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
