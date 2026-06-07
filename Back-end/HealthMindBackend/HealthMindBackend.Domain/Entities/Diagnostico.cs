using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.Validations;
using HealthMindBackend.Domain.ValueObjects.Saude;
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
        public Cid Cid { get; private set; }
        public DateTime DataDiagnostico { get; private set; }
        public StatusDiagnosticoEnum StatusDiagnostico { get; set; }
        public String Observacoes { get; private set; }

        public Diagnostico()
        {
        }

        public Diagnostico(String id, String pacienteId, String prontuarioId, String descricao, Cid cid, DateTime dataDiagnostico, StatusDiagnosticoEnum statusDiagnostico, String observacoes)
        {
            DomainExceptionValidation.Validate(String.IsNullOrEmpty(id), "Id do diagnóstico inválido");
            DefinirId(id);
            ValidateDiagnosticosDomain(pacienteId, prontuarioId, descricao, dataDiagnostico, statusDiagnostico, observacoes);
            Cid = cid;
        }

        public Diagnostico(String pacienteId, String prontuarioId, String descricao, Cid cid, DateTime dataDiagnostico, StatusDiagnosticoEnum statusDiagnostico, String observacoes)
        {
            ValidateDiagnosticosDomain(pacienteId, prontuarioId, descricao, dataDiagnostico, statusDiagnostico, observacoes);
            Cid = cid;
        }

        private void ValidateDiagnosticosDomain(String pacienteId, String prontuarioId, String descricao, DateTime dataDiagnostico, StatusDiagnosticoEnum statusDiagnostico, String observacoes)
        {
            DomainExceptionValidation.Validate(statusDiagnostico == StatusDiagnosticoEnum.StsNone, "Status do diagnóstico inválido.");

            PacienteId = pacienteId;
            ProntuarioId = prontuarioId;
            Descricao = descricao;
            DataDiagnostico = dataDiagnostico;
            StatusDiagnostico = statusDiagnostico;
            Observacoes = observacoes;
        }

        public void Update(String pacienteId, String prontuarioId, String descricao, Cid cid, DateTime dataDiagnostico, StatusDiagnosticoEnum statusDiagnostico, String observacoes)
        {
            ValidateDiagnosticosDomain(pacienteId, prontuarioId, descricao, dataDiagnostico, statusDiagnostico, observacoes);
            Cid = cid;
        }
    }
}

