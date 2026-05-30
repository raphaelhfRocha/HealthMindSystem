export class Cep {
    private readonly value: string;

    constructor(value: string) {
        const normalized = value.replace(/\D/g, '');

        if (normalized.length !== 8) {
            throw new Error('CEP inválido');
        }

        this.value = normalized;
    }

    get formatted(): string {
        return this.value.replace(
            /(\d{5})(\d{3})/,
            '$1-$2'
        );
    }
}