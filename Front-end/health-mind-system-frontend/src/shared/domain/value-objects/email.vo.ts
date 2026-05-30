export class Email {
    constructor(private readonly value: string) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regex.test(value)) {
            throw new Error('Email inválido');
        }
    }

    get endereco(): string {
        return this.value.toLowerCase().trim();
    }

    get dominio(): string {
        return this.value.split('@')[1];
    }
}