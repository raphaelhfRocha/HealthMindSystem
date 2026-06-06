using FluentValidation;
using HealthMindBackend.Application.Prontuarios.Commands;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Domain.ValueObjects.Contato.ContatoEmergencia;
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
    public class ProntuarioUpdateCommandHandler : IRequestHandler<ProntuarioUpdateCommand, Prontuario>
    {
        private readonly IValidator<ProntuarioUpdateCommand> _validatorProntuarioUpdateCommand;
        private readonly IProntuarioRepository _prontuarioRepository;

        public ProntuarioUpdateCommandHandler(IValidator<ProntuarioUpdateCommand> validatorProntuarioUpdateCommand, IProntuarioRepository prontuarioRepository)
        {
            _validatorProntuarioUpdateCommand = validatorProntuarioUpdateCommand;
            _prontuarioRepository = prontuarioRepository;
        }

        public async Task<Prontuario> Handle(ProntuarioUpdateCommand request, CancellationToken cancellationToken)
        {
            await _validatorProntuarioUpdateCommand.ValidateAndThrowAsync(request);

            var prontuarioFound = await _prontuarioRepository.GetProntuarioById(request.Id);

            if (prontuarioFound == null)
                throw new KeyNotFoundException("Prontuario não encontrado.");

            prontuarioFound.Update(request.PacienteId, request.Anotacoes, request.StatusProntuario);

            var result = await _prontuarioRepository.EditarProntuario(prontuarioFound);

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

                var contatoEmergenciaSemEndereco = new ContatoEmergencia(
                    result.Id,
                    request.ContatoEmergencia.Nome,
                    request.ContatoEmergencia.Telefone,
                    request.ContatoEmergencia.RelacaoParentesco
                );

                var contatoEmergenciaSemEnderecoDefinido = contatoEmergenciaSemEndereco != null
                    ? await _prontuarioRepository.DefinirContatoEmergencia(result.Id, contatoEmergenciaSemEndereco)
                    : null;

                result.ContatoEmergencia = contatoEmergenciaSemEnderecoDefinido;

                return result;
            }

            return result;
        }
    }
}
