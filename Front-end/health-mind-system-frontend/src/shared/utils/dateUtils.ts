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

export const toDateInput = (value?: Date | string): string => {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};


const DATE_KEY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})/;

export const extractDateKey = (value: string | Date): string => {
  if (value instanceof Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const match = value.match(DATE_KEY_PATTERN);
  if (match) {
    return match[0];
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value.slice(0, 10);
  }

  return extractDateKey(parsed);
}

export const formatDateLabel = (dateKey: string): string => {
    const [year, month, day] = dateKey.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    if (Number.isNaN(date.getTime())) {
        return dateKey;
    }

    return new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date).replace(/^./, char => char.toUpperCase());
}

export const getDiaSemana = (data: string | Date): string => {
    const parsedDate = data instanceof Date
        ? data
        : new Date(data);

    if (Number.isNaN(parsedDate.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
    })
        .format(parsedDate)
        .replace(/^./, char => char.toUpperCase());
}

export const formatDataBR = (dateKey: string): string => {
    if (!dateKey) return "—";
    const [year, month, day] = dateKey.split("-");
    if (!year || !month || !day) return "—";
    return `${day}/${month}/${year}`;
}