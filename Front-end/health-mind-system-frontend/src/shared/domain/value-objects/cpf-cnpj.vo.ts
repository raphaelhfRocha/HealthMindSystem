export class CpfCnpj {
    private readonly value: string;

    constructor(value: string) {
        const normalized = value.replace(/\D/g, '');

        if (normalized.length !== 11 && normalized.length !== 14) {
            throw new Error('CPF/CNPJ inválido');
        }

        this.value = normalized;
    }

    get raw(): string {
        return this.value;
    }

    get formatted(): string {
        if (this.value.length === 11) {
            return this.value.replace(
                /(\d{3})(\d{3})(\d{3})(\d{2})/,
                '$1.$2.$3-$4'
            );
        }

        return this.value.replace(
            /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
            '$1.$2.$3/$4-$5'
        );
    }
}