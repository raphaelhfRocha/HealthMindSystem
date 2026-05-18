using FluentValidation;
using HealthMindBackend.Application.Behaviors;
using HealthMindBackend.Application.Diagnosticos.Handlers;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Application.Mappings;
using HealthMindBackend.Application.Services;
using HealthMindBackend.Application.Validators.Diagnosticos;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Enums;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Infrastructure.Configurations;
using HealthMindBackend.Infrastructure.Mappings.Serializers;
using HealthMindBackend.Infrastructure.Persistence.Context;
using HealthMindBackend.Infrastructure.Persistence.Sequences;
using HealthMindBackend.Infrastructure.Repositories;
using HealthMindBackend.Infrastructure.Security.JWT;
using HealthMindBackend.Infrastructure.Security.PasswordHasher;
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

            services.AddScoped<IAuthRepository, AuthRepository>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddTransient<IPasswordHasherService, PasswordHasherService>();
            services.AddTransient<ITokenService, TokenService>();
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

            // Registers all validators from the Application assembly.
            services.AddValidatorsFromAssemblyContaining<DiagnosticoCreateCommandValidator>();

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
