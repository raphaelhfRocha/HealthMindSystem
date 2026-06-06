using FluentValidation;
using HealthMindBackend.Application.Prontuarios.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.ValueObjects.Contato.ContatoEmergencia;
using HealthMindBackend.Domain.ValueObjects.Convenios.PlanoSaudePaciente;
using HealthMindBackend.Domain.ValueObjects.Local;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace HealthMindBackend.Application.Prontuarios.Handlers
{
    public class ProntuarioCreateCommandHandler : IRequestHandler<ProntuarioCreateCommand, Prontuario>
    {
        private readonly IValidator<ProntuarioCreateCommand> _validatorProntuarioCreateCommand;
        private readonly IProntuarioRepository _prontuarioRepository;

        public ProntuarioCreateCommandHandler(IValidator<ProntuarioCreateCommand> validatorProntuarioCreateCommand, IProntuarioRepository prontuarioRepository)
        {
            _validatorProntuarioCreateCommand = validatorProntuarioCreateCommand;
            _prontuarioRepository = prontuarioRepository;
        }

        public async Task<Prontuario> Handle(ProntuarioCreateCommand request, CancellationToken cancellationToken)
        {
            await _validatorProntuarioCreateCommand.ValidateAndThrowAsync(request);

            var prontuario = new Prontuario(
                request.PacienteId,
                request.Anotacoes,
                request.DataAbertura ?? DateTime.UtcNow,
                request.StatusProntuario,
                request.Medicamentos
            );

            var result = await _prontuarioRepository.AdicionarProntuario(prontuario);

            if (request.ContatoEmergencia != null)
            {
                if (request.ContatoEmergencia.Endereco != null)
                {
                    var endereco = new Endereco(
                        request.ContatoEmergencia.Endereco.Cep,
                        request.ContatoEmergencia.Endereco.Logradouro,
                        request.ContatoEmergencia.Endereco.Complemento,
                        request.ContatoEmergencia.Endereco.Bairro,
                        request.ContatoEmergencia.Endereco.UF,
                        request.ContatoEmergencia.Endereco.Localidade,
                        request.ContatoEmergencia.Endereco.Regiao
                    );

                    var contatoEmergenciaComEndereco = new ContatoEmergencia(
                        result.Id,
                        request.ContatoEmergencia.Nome,
                        request.ContatoEmergencia.Telefone,
                        request.ContatoEmergencia.RelacaoParentesco,
                        endereco
                    );

                    var contatoEmergenciaComEnderecoDefinido = contatoEmergenciaComEndereco != null
                    ? await _prontuarioRepository.DefinirContatoEmergencia(result.Id, contatoEmergenciaComEndereco)
                    : null;

                    result.ContatoEmergencia = contatoEmergenciaComEnderecoDefinido;

                    return result;
                }

                var contatoEmergencia = new ContatoEmergencia(
                    result.Id,
                    request.ContatoEmergencia.Nome,
                    request.ContatoEmergencia.Telefone,
                    request.ContatoEmergencia.RelacaoParentesco
                );

                var contatoEmergenciaDefinido = contatoEmergencia != null
                    ? await _prontuarioRepository.DefinirContatoEmergencia(result.Id, contatoEmergencia)
                    : null;

                result.ContatoEmergencia = contatoEmergenciaDefinido;

                return result;
            }

            return result;
        }
    }
}
