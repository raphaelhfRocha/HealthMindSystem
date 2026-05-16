using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.Validations;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.Entities
{
    public class Diagnostico : Identity
    {
        public String PacienteId { get; private set; }
        public String ProntuarioId { get; private set; }
        public String Descricao { get; private set; }
        public String Cid { get; private set; }
        public DateTime DataDiagnostico { get; private set; }
        public StatusDiagnosticoEnum StatusDiagnostico { get; set; }
        public String Observacoes { get; private set; }

        public Diagnostico()
        {
        }

        public Diagnostico(String id, String pacienteId, String prontuarioId, String descricao, String cid, DateTime dataDiagnostico, StatusDiagnosticoEnum statusDiagnostico, String observacoes)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(id), "Id do diagnóstico inválido");
            DefinirId(id);
            ValidateDiagnosticosDomain(pacienteId, prontuarioId, descricao, cid, dataDiagnostico, statusDiagnostico, observacoes);
        }

        public Diagnostico(String pacienteId, String prontuarioId, String descricao, String cid, DateTime dataDiagnostico, StatusDiagnosticoEnum statusDiagnostico, String observacoes)
        {
            ValidateDiagnosticosDomain(pacienteId, prontuarioId, descricao, cid, dataDiagnostico, statusDiagnostico, observacoes);
        }

        private void ValidateDiagnosticosDomain(String pacienteId, String prontuarioId, String descricao, String cid, DateTime dataDiagnostico, StatusDiagnosticoEnum statusDiagnostico, String observacoes)
        {
            DomainExceptionValidation.Validate(statusDiagnostico == StatusDiagnosticoEnum.StsNone, "Status do diagnóstico inválido.");

            PacienteId = pacienteId;
            ProntuarioId = prontuarioId;
            Descricao = descricao;
            Cid = cid;
            DataDiagnostico = dataDiagnostico;
            StatusDiagnostico = statusDiagnostico;
            Observacoes = observacoes;
        }

        public void Update(String pacienteId, String prontuarioId, String descricao, String cid, DateTime dataDiagnostico, StatusDiagnosticoEnum statusDiagnostico, String observacoes)
        {
            ValidateDiagnosticosDomain(pacienteId, prontuarioId, descricao, cid, dataDiagnostico, statusDiagnostico, observacoes);
        }
    }
}

