export const formatCurrency = (value: number): string => {
    if (value === null || value === undefined) {
        return 'R$ 0,00';
    }

    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
};