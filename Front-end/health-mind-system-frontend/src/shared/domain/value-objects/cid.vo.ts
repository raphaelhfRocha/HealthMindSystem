export class Cid {
    constructor(private readonly value: string) {
        const regex = /^[A-Z][0-9]{2}(\.[0-9])?$/;

        if (!regex.test(value.toUpperCase())) {
            throw new Error('CID inválido');
        }
    }

    get codigo(): string {
        return this.value.toUpperCase();
    }
}