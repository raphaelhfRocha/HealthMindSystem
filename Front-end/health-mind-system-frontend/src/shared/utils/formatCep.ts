export const formatCep = (value: string): string => {
    if (!value) return "";

    const cleaned = value.replace(/\D/g, '').slice(0, 8);

    if (cleaned.length <= 5) {
        return cleaned;
    }

    return cleaned.replace(/^(\d{5})(\d)/, '$1-$2');
};