using HealthMindBackend.Application.Diagnosticos.Handlers;
using HealthMindBackend.Application.HistoricosMedicos.Handlers;
using HealthMindBackend.Application.Interfaces;
using HealthMindBackend.Application.Mappings;
using HealthMindBackend.Application.Pacientes.Handlers;
using HealthMindBackend.Application.Progressoes.Handlers;
using HealthMindBackend.Application.Prontuarios.Handlers;
using HealthMindBackend.Application.Psicologos.Handlers;
using HealthMindBackend.Application.Recepcionistas.Handlers;
using HealthMindBackend.Application.Services;
using HealthMindBackend.Domain.Entities;
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Infrastructure.Configurations;
using HealthMindBackend.Infrastructure.Persistence.Context;
using HealthMindBackend.Infrastructure.Persistence.Sequences;
using HealthMindBackend.Infrastructure.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.IoC
{
    public static class DependencyInjectionAPI
    {
        public static IServiceCollection AddInfrastructureAPI(this IServiceCollection services, IConfiguration configuration)
        {
            RegisterMongoClassMaps();

            services.Configure<MongoDbSettings>(
                configuration.GetSection("MongoDbSettings"));

            services.AddSingleton<IMongoDbContext, MongoDbContext>();
            services.AddSingleton(sp => (MongoDbContext)sp
                .GetRequiredService<IMongoDbContext>());
            services.AddScoped<ISequentialIdGenerator, SequentialIdGenerator>();

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

            services.AddAutoMapper(_ => { }, typeof(DomainToDTOMappingsProfile).Assembly);

            services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<GetAllDiagnosticosQueryHandler>());
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<GetAllHistoricosQueryHandler>());
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<GetAllPacientesQueryHandler>());
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<GetAllProgressoesQueryHandler>());
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<GetAllProntuariosQueryHandler>());
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<GetAllPsicologosQueryHandler>());
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<GetAllRecepcionistasQueryHandler>());

            return services;
        }

        private static void RegisterMongoClassMaps()
        {
            if (!BsonClassMap.IsClassMapRegistered(typeof(Prontuario)))
            {
                BsonClassMap.RegisterClassMap<Prontuario>(classMap =>
                {
                    classMap.AutoMap();
                    classMap.SetIgnoreExtraElements(true);
                    classMap.MapMember(prontuario => prontuario.Medicamentos).SetElementName("medicamentos");
                });
            }
        }
    }
}
