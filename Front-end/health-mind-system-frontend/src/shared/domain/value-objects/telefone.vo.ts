export class Telefone {
    private readonly value: string;

    constructor(value: string) {
        const normalized = value.replace(/\D/g, '');

        if (normalized.length < 10 || normalized.length > 11) {
            throw new Error('Telefone inválido');
        }

        this.value = normalized;
    }

    get formatted(): string {
        if (this.value.length === 11) {
            return this.value.replace(
                /(\d{2})(\d{5})(\d{4})/,
                '($1) $2-$3'
            );
        }

        return this.value.replace(
            /(\d{2})(\d{4})(\d{4})/,
            '($1) $2-$3'
        );
    }
}