using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.Validations;
using HealthMindBackend.Domain.ValueObjects.Base;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.ValueObjects.Evolucao.MetasTerapeuticas
{
    [BsonIgnoreExtraElements]
    public class MetaTerapeutica : ValueObject
    {
        public String Id { get; private set; }
        public String HistoricoMedicoId { get; set; }
        public String Titulo { get; private set; }
        public StatusMetaTerapeuticaEnum StatusMetaTerapeutica { get; private set; }
        public String? Observacoes { get; private set; }

        public MetaTerapeutica()
        {
        }
        public MetaTerapeutica(String id, String historicoMedicoId, String titulo, StatusMetaTerapeuticaEnum statusMetaTerapeutica, String? observacoes)
        {
            DomainExceptionValidation.Validate(String.IsNullOrWhiteSpace(id), "Id Meta Terapeutica inválido.");
            Id = id;
            HistoricoMedicoId = historicoMedicoId;
            Titulo = titulo;
            StatusMetaTerapeutica = statusMetaTerapeutica;
            Observacoes = observacoes;
        }

        public MetaTerapeutica(String historicoMedicoId, String titulo, StatusMetaTerapeuticaEnum statusMetaTerapeutica, String? observacoes)
        {
            HistoricoMedicoId = historicoMedicoId;
            Titulo = titulo;
            StatusMetaTerapeutica = statusMetaTerapeutica;
            Observacoes = observacoes;
        }
        public MetaTerapeutica(String titulo, StatusMetaTerapeuticaEnum statusMetaTerapeutica, String? observacoes)
        {
            Titulo = titulo;
            StatusMetaTerapeutica = statusMetaTerapeutica;
            Observacoes = observacoes;
        }

        public void Update(String titulo, StatusMetaTerapeuticaEnum statusMetaTerapeutica, String? observacoes)
        {
            Titulo = titulo;
            StatusMetaTerapeutica = statusMetaTerapeutica;
            Observacoes = observacoes;
        }

        public void DefinirId(String id)
        {
            DomainExceptionValidation.Validate(String.IsNullOrWhiteSpace(id), "Id inválido.");
            Id = id;
        }

        protected override IEnumerable<Object> GetEqualityComponents()
        {
            yield return new Object[]
            {
                Id,
                Titulo,
                StatusMetaTerapeutica,
                Observacoes
            };
        }
    }
}
