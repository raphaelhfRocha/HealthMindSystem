export const formatPhone = (phone: string): string => {
    if (!phone) return '';

    const cleanedPhone = phone.replace(/\D/g, '').slice(0, 11);

    return cleanedPhone
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d)(\d{4})$/, '$1-$2');
};