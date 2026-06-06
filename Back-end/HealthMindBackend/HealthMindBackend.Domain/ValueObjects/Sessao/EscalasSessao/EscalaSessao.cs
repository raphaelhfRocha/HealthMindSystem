using HealthMindBackend.Domain.Validations;
using HealthMindBackend.Domain.ValueObjects.Base;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.ValueObjects.Sessao.EscalasSessao
{
    [BsonIgnoreExtraElements]
    public class EscalaSessao : ValueObject
    {
        public String? Id { get; private set; }
        public String SessaoId { get; set; }
        public Int32 Humor { get; private set; }
        public Int32 Ansiedade { get; private set; }
        public Int32 Sono { get; private set; }
        public Int32 FuncSocial { get; private set; }

        public EscalaSessao()
        {
        }

        public EscalaSessao(String? id, String sessaoId, Int32 humor, Int32 ansiedade, Int32 sono, Int32 funcSocial)
        {
            Id = id;
            SessaoId = sessaoId;
            Humor = humor;
            Ansiedade = ansiedade;
            Sono = sono;
            FuncSocial = funcSocial;
        }
        public EscalaSessao(String sessaoId, Int32 humor, Int32 ansiedade, Int32 sono, Int32 funcSocial)
        {
            SessaoId = sessaoId;
            Humor = humor;
            Ansiedade = ansiedade;
            Sono = sono;
            FuncSocial = funcSocial;
        }
        public EscalaSessao(Int32 humor, Int32 ansiedade, Int32 sono, Int32 funcSocial)
        {
            Humor = humor;
            Ansiedade = ansiedade;
            Sono = sono;
            FuncSocial = funcSocial;
        }

        public void DefinirId(String? id)
        {
            DomainExceptionValidation.Validate(String.IsNullOrWhiteSpace(id), "Id inválido.");
            Id = id;
        }

        public void Update(String sessaoId, Int32 humor, Int32 ansiedade, Int32 sono, Int32 funcSocial)
        {
            SessaoId = sessaoId;
            Humor = humor;
            Ansiedade = ansiedade;
            Sono = sono;
            FuncSocial = funcSocial;
        }

        protected override IEnumerable<Object> GetEqualityComponents()
        {
            return new Object[]
            {
                Id,
                SessaoId,
                Humor,
                Ansiedade,
                Sono,
                FuncSocial
            };
        }
    }
}
