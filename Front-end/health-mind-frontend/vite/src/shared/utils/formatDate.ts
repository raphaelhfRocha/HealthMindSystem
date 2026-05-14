export const formatDate = (date: string | Date): string => {
    if (!date) return '';

    const parsedDate = new Date(date);

    return parsedDate.toLocaleDateString('pt-BR');
};

export const formatDateTime = (date: string | Date): string => {
    if (!date) return '';

    const parsedDate = new Date(date);

    return parsedDate.toLocaleString('pt-BR');
};