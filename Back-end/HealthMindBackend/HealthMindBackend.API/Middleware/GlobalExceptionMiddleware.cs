using FluentValidation;
using HealthMindBackend.Domain.Validations;

namespace HealthMindBackend.API.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (ValidationException ex)
            {
                _logger.LogWarning(ex, "Erro de validação FluentValidation");
                await HandleFluentValidationException(context, ex);
            }
            catch (DomainExceptionValidation ex)
            {
                _logger.LogWarning(ex, "Erro de validação de domínio");
                await HandleDomainException(context, ex);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Recurso não encontrado");
                await HandleNotFoundException(context, ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro não tratado");
                await HandleUnexpectedException(context, ex);
            }
        }

        private static Task HandleFluentValidationException(HttpContext context, ValidationException ex)
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            context.Response.ContentType = "application/json";

            var response = new
            {
                error = "Falha na validação dos dados enviados",
                code = "VALIDATION_ERROR",
                details = ex.Errors
                    .Where(failure => failure is not null)
                    .Select(failure => new
                    {
                        field = failure.PropertyName,
                        message = failure.ErrorMessage
                    })
            };

            return context.Response.WriteAsJsonAsync(response);
        }

        private static Task HandleDomainException(HttpContext context, DomainExceptionValidation ex)
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            context.Response.ContentType = "application/json";

            var response = new { error = ex.Message, code = "VALIDATION_ERROR" };
            return context.Response.WriteAsJsonAsync(response);
        }

        private static Task HandleNotFoundException(HttpContext context, KeyNotFoundException ex)
        {
            context.Response.StatusCode = StatusCodes.Status404NotFound;
            context.Response.ContentType = "application/json";

            var response = new { error = ex.Message, code = "NOT_FOUND" };
            return context.Response.WriteAsJsonAsync(response);
        }

        private static Task HandleUnexpectedException(HttpContext context, Exception ex)
        {
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/json";

            var response = new { error = "Erro interno do servidor", code = "INTERN_ERROR" };
            return context.Response.WriteAsJsonAsync(response);
        }
    }
}
