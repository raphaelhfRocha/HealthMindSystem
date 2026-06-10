using HealthMindBackend.Domain.Enums;
using System;

namespace HealthMindBackend.Domain.Interfaces
{
    public interface IGeradorCredenciaisService
    {
        String GerarEmail(String nome, StatusCargoEnum cargo);
        String GerarSenha(String nome);
    }
}
