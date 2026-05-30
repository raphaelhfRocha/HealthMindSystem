using HealthMindBackend.Domain.Validations;
using HealthMindBackend.Domain.ValueObjects.Base;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.ValueObjects.Saude.Medicamento
{
    [BsonIgnoreExtraElements]
    public class Medicamento : ValueObject
    {
        public String Id { get; private set; }
        public String ProntuarioId { get; set; }
        public String Nome { get; private set; }
        public String Dosagem { get; private set; }
        public String Frequencia { get; private set; }

        public Medicamento()
        {
        }
        public Medicamento(String nome, String dosagem, String frequencia)
        {
            Id = $"MED-{Guid.NewGuid():N}";
            ValidateMedicamentoDomain(nome, dosagem, frequencia);
            //ProntuarioId = prontuarioId;
        }

        private void ValidateMedicamentoDomain(String nome, String dosagem, String frequencia)
        {
            Nome = nome;
            Dosagem = dosagem;
            Frequencia = frequencia;
        }

        public void Update(String nome, String dosagem, String frequencia)
        {
            ValidateMedicamentoDomain(nome, dosagem, frequencia);
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
                ProntuarioId,
                Nome,
                Dosagem,
                Frequencia
            };
        }
    }
}
