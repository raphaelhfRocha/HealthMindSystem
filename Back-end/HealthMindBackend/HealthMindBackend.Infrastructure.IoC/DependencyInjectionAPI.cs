using FluentValidation;
using HealthMindBackend.Application.Behaviors;
using HealthMindBackend.Application.CoberturasPlanos.Commands;
using HealthMindBackend.Application.Diagnosticos.Commands;
using HealthMindBackend.Application.Diagnosticos.Handlers;
using HealthMindBackend.Application.Disponibilidades.Commands;
using HealthMindBackend.Application.DTOs;
using HealthMindBackend.Application.EscalasSessoes.Commands;
using HealthMindBackend.Application.HistoricosMedicos.Commands;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Application.Mappings;
using HealthMindBackend.Application.Medicamentos.Commands;
using HealthMindBackend.Application.Pacientes.Commands;
using HealthMindBackend.Application.Pagamentos.Commands;
using HealthMindBackend.Application.Progressoes.Commands;
using HealthMindBackend.Application.Prontuarios.Commands;
using HealthMindBackend.Application.Psicologos.Commands;
using HealthMindBackend.Application.Services;
using HealthMindBackend.Application.Sessoes.Commands;
using HealthMindBackend.Application.Validators.CoberturasPlanos;
using HealthMindBackend.Application.Validators.Diagnosticos;
using HealthMindBackend.Application.Validators.Disponibilidades;
using HealthMindBackend.Application.Validators.EscalasSessoes;
using HealthMindBackend.Application.Validators.HistoricosMedicos;
using HealthMindBackend.Application.Validators.Medicamentos;
using HealthMindBackend.Application.Validators.Pacientes;
using HealthMindBackend.Application.Validators.Pagamentos;
using HealthMindBackend.Application.Validators.Progressoes;
using HealthMindBackend.Application.Validators.Prontuarios;
using HealthMindBackend.Application.Validators.Psicologos;
using HealthMindBackend.Application.Validators.Recepcionistas;
using HealthMindBackend.Application.Validators.Sessoes;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Infrastructure.Configurations;
using HealthMindBackend.Infrastructure.Mappings.Serializers;
using HealthMindBackend.Infrastructure.Persistence.Context;
using HealthMindBackend.Infrastructure.Persistence.Sequences;
using HealthMindBackend.Infrastructure.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Bson.Serialization;

namespace HealthMindBackend.Infrastructure.IoC
{
    public static class DependencyInjectionAPI
    {
        public static IServiceCollection AddInfrastructureAPI(this IServiceCollection services, IConfiguration configuration)
        {

            services.Configure<MongoDbSettings>(
                configuration.GetSection("MongoDbSettings"));

            services.AddSingleton<IMongoDbContext, MongoDbContext>();
            services.AddSingleton(sp => (MongoDbContext)sp
                .GetRequiredService<IMongoDbContext>());
            services.AddScoped<ISequentialIdGenerator, SequentialIdGenerator>();

            BsonSerializer.TryRegisterSerializer(typeof(StatusCargoEnum),
                new StatusCargoEnumSerializer());
            BsonSerializer.TryRegisterSerializer(typeof(StatusDiagnosticoEnum),
                new StatusDiagnosticoEnumSerializer());
            BsonSerializer.TryRegisterSerializer(typeof(StatusDisponibilidadeEnum),
                new StatusDisponibilidadeEnumSerializer());
            BsonSerializer.TryRegisterSerializer(typeof(StatusFormaPagamentoEnum),
                new StatusFormaPagamentoEnumSerializer());
            BsonSerializer.TryRegisterSerializer(typeof(StatusPagamentoEnum),
                new StatusPagamentoEnumSerializer());
            BsonSerializer.TryRegisterSerializer(typeof(StatusParceladoEnum),
                new StatusParceladoEnumSerializer());
            BsonSerializer.TryRegisterSerializer(typeof(StatusProntuarioEnum),
                new StatusProntuarioEnumSerializer());
            BsonSerializer.TryRegisterSerializer(typeof(StatusRoleEnum),
                new StatusRoleEnumSerializer());
            BsonSerializer.TryRegisterSerializer(typeof(StatusSessaoEnum),
                new StatusSessaoEnumSerializer());
            BsonSerializer.TryRegisterSerializer(typeof(StatusTipoAtendimentoEnum),
                new StatusTipoAtendimentoEnumSerializer());
            BsonSerializer.TryRegisterSerializer(typeof(StatusPlanoSaudeEnum),
                new StatusPlanoSaudeEnumSerializer());
            BsonSerializer.TryRegisterSerializer(typeof(StatusMetaTerapeuticaEnum),
                new StatusMetaTerapeuticaEnumSerializer());
            BsonSerializer.TryRegisterSerializer(typeof(StatusMedicamentoUsoEnum),
                new StatusMedicamentoUsoEnumSerializer());

            services.AddScoped<IDiagnosticoRepository, DiagnosticoRepository>();
            services.AddScoped<IDiagnosticoService, DiagnosticoService>();
            services.AddScoped<IHistoricoMedicoRepository, HistoricoMedicoRepository>();
            services.AddScoped<IHistoricoMedicoService, HistoricoMedicoService>();
            services.AddScoped<IPacienteRepository, PacienteRepository>();
            services.AddScoped<IPacienteService, PacienteService>();
            services.AddScoped<IProgressaoRepository, ProgressaoRepository>();
            services.AddScoped<IProgressaoService, ProgressaoService>();
            services.AddScoped<IProntuarioRepository, ProntuarioRepository>();
            services.AddScoped<IProntuarioService, ProntuarioService>();
            services.AddScoped<IPsicologoRepository, PsicologoRepository>();
            services.AddScoped<IPsicologoService, PsicologoService>();
            services.AddScoped<IRecepcionistaRepository, RecepcionistaRepository>();
            services.AddScoped<IRecepcionistaService, RecepcionistaService>();
            services.AddScoped<ISessaoRepository, SessaoRepository>();
            services.AddScoped<ISessaoService, SessaoService>();
            services.AddScoped<IPlanoSaudeService, PlanoSaudeService>();
            services.AddScoped<IPlanoSaudeRepository, PlanoSaudeRepository>();

            services.AddScoped<IValidator<DiagnosticoCreateCommand>, DiagnosticoCreateCommandValidator>();
            services.AddScoped<IValidator<DiagnosticoUpdateCommand>, DiagnosticoUpdateCommandValidator>();
            services.AddScoped<IValidator<DisponibilidadeCreateCommand>, DisponibilidadeCreateCommandValidator>();
            services.AddScoped<IValidator<HistoricoMedicoCreateCommand>, HistoricoMedicoCreateCommandValidator>();
            services.AddScoped<IValidator<HistoricoMedicoUpdateCommand>, HistoricoMedicoUpdateCommandValidator>();
            services.AddScoped<IValidator<MedicamentoCreateCommand>, MedicamentoCreateCommandValidator>();
            services.AddScoped<IValidator<MedicamentoUpdateCommand>, MedicamentoUpdateCommandValidator>();
            services.AddScoped<IValidator<PacienteCreateCommand>, PacienteCreateCommandValidator>();
            services.AddScoped<IValidator<PacienteUpdateCommand>, PacienteUpdateCommandValidator>();
            services.AddScoped<IValidator<PagamentoUpdateCommand>, PagamentoUpdateCommandValidator>();
            services.AddScoped<IValidator<ProgressaoCreateCommand>, ProgressaoCreateCommandValidator>();
            services.AddScoped<IValidator<ProntuarioCreateCommand>, ProntuarioCreateCommandValidator>();
            services.AddScoped<IValidator<ProntuarioUpdateCommand>, ProntuarioUpdateCommandValidator>();
            services.AddScoped<IValidator<CoberturaPlanoCreateCommand>, CoberturaPlanoCreateCommandValidator>();
            services.AddScoped<IValidator<CoberturaPlanoUpdateCommand>, CoberturaPlanoUpdateCommandValidator>();
            services.AddScoped<IValidator<PsicologoCreateCommand>, PsicologoCreateCommandValidator>();
            services.AddScoped<IValidator<PsicologoUpdateCommand>, PsicologoUpdateCommandValidator>();
            services.AddScoped<IValidator<SessaoCreateCommand>, SessaoCreateCommandValidator>();
            services.AddScoped<IValidator<SessaoUpdateCommand>, SessaoUpdateCommandValidator>();
            services.AddScoped<IValidator<EscalaSessaoCreateCommand>, EscalaSessaoCreateCommandValidator>();
            services.AddScoped<IValidator<EscalaSessaoUpdateCommand>, EscalaSessaoUpdateCommandValidator>();

            services.AddAutoMapper(_ => { }, typeof(DomainToDTOMappingsProfile).Assembly);

            services.AddMediatR(cfg =>
            {
                cfg.RegisterServicesFromAssemblyContaining<GetAllDiagnosticosQueryHandler>();
                cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
            });

            return services;
        }
    }
}
