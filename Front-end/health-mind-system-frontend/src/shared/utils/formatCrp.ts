export const formatCrp = (crp: string): string => {
    if (!crp) return '';

    const cleanedCrp = crp.replace(/\D/g, '');

    if (cleanedCrp.length <= 2) {
        return cleanedCrp;
    }

    return cleanedCrp.replace(/^(\d{2})(\d+)/, '$1/$2');
};