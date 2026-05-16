using FluentValidation;
using HealthMindBackend.Application.Pagamentos.Commands;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Validators.Pagamentos
{
    public class PagamentoUpdateCommandValidator : AbstractValidator<PagamentoUpdateCommand>
    {
        public PagamentoUpdateCommandValidator()
        {
            RuleFor(p => p.Valor)
                .NotEmpty().WithMessage("Valor Obrigatório")
                .Must(p => p < 0).WithMessage("O valor do pagamento não pode ser negativo")
                .Must(p => p == 0).WithMessage("O valor do pagamento não pode ser zero");

            RuleFor(p => p.TotalParcelas)
                .Must(d => d < 0).WithMessage("O total de parcelas não pode ser negativo");
        }
    }
}
