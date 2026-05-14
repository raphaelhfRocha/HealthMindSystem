using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace HealthMindBackend.Infrastructure.IoC
{
    public static class DependencyInjectionCORS
    {
        public static IServiceCollection AddInfrastructureCORS(this IServiceCollection services, IConfiguration configuration, IHostEnvironment environment)
        {
            // Configuração CORS mais permissiva para desenvolvimento
            var corsOrigins = configuration.GetSection("cors:Endpoint").Get<string[]>()
                ?? new[] { "" };

            services.AddCors(options =>
            {
                options.AddPolicy(name: "CorsPolicy",
                    corsBuilder =>
                    {
                        if (environment.IsDevelopment())
                        {
                            // Em desenvolvimento, permitir qualquer origem (incluindo file://)
                            corsBuilder.AllowAnyOrigin()
                                .AllowAnyMethod()
                                .AllowAnyHeader();
                        }
                        else
                        {
                            // Em produção, usar origens específicas
                            corsBuilder.WithOrigins(corsOrigins)
                                .AllowAnyMethod()
                                .AllowCredentials()
                                .AllowAnyHeader();
                        }
                    });
            });

            return services;
        }
    }
}
