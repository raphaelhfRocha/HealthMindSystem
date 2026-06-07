using HealthMindBackend.Domain.Validations;
using HealthMindBackend.Domain.ValueObjects.Base;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.ValueObjects.Sessao.RegistroSessao
{
    [BsonIgnoreExtraElements]
    public class RegistroSessao : ValueObject
    {
        public String Id { get; private set; }
        public String SessaoId { get; set; }
        public String Registro { get; private set; }

        public RegistroSessao()
        {
        }

        public RegistroSessao(String id, String sessaoId, String registro)
        {
            Id = id;
            SessaoId = sessaoId;
            Registro = registro;
        }

        public RegistroSessao(String sessaoId, String registro)
        {
            SessaoId = sessaoId;
            Registro = registro;
        }

        public void DefinirId(String id)
        {
            DomainExceptionValidation.Validate(String.IsNullOrWhiteSpace(id), "Id inválido.");
            Id = id;
        }

        public void Update(String registro)
        {
            Registro = registro;
        }

        protected override IEnumerable<Object> GetEqualityComponents()
        {
            yield return new Object[]
            {
                Id,
                SessaoId,
                Registro
            };
        }
    }
}