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
using HealthMindBackend.Domain.Interfaces;
using HealthMindBackend.Infrastructure.Persistence;
using HealthMindBackend.Infrastructure.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Infrastructure.IoC
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            // Obtém a connection string do appsettings.json
            var mongoConnectionString = configuration.GetConnectionString("MongoDb");
            var mongoDatabaseName = configuration.GetSection("MongoDbSettings:Database").Value;

            // Registra o MongoClient como singleton
            services.AddSingleton<IMongoClient>(sp => new MongoClient(mongoConnectionString));

            // Registra o contexto customizado
            services.AddScoped<MongoDbContext>(sp =>
            {
                var client = sp.GetRequiredService<IMongoClient>();
                return new MongoDbContext(client, mongoDatabaseName);
            });

            services.AddScoped<IDiagnosticoRepository, DiagnosticoRepository>();
            services.AddScoped<IDiagnosticoService, DiagnosticoService>();
            services.AddScoped<IHistoricoMedicoRepository, HistoricoMedicoRepository>();
            services.AddScoped<HistoricoMedicoService,HistoricoMedicoService>();
            services.AddScoped<PacienteRepository, PacienteRepository>();
            services.AddScoped<IPacienteService, PacienteService>();
            services.AddScoped<IProgressaoRepository, ProgressaoRepository>();
            services.AddScoped<IProgressaoService, ProgressaoService>();
            services.AddScoped<IProntuarioRepository, ProntuarioRepository>();
            services.AddScoped<IProntuarioService,ProntuarioService>();
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
    }
}
