export class Crp {
    constructor(private readonly value: string) {
        if (value.length < 5) {
            throw new Error('CRP inválido');
        }
    }

    get numero(): string {
        return this.value;
    }
}