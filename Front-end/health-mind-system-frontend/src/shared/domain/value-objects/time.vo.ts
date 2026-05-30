export class Time {
    private constructor(private readonly valor: string) { }

    public static criar(valor: string): Time {
        const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;

        if (!regex.test(valor))
            throw new Error("Horário inválido");

        return new Time(valor);
    }

    public getValue(): string {
        return this.valor;
    }
}