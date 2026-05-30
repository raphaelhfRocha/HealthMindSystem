export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function formatCpfCnpj(value: string) {
  const digits = onlyDigits(value).slice(0, 14);

  if (digits.length <= 11) {
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2");
  }

  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/\/(\d{4})(\d)/, "/$1-$2");
}

export function formatCrp(value: string) {
  const digits = onlyDigits(value).slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function normalizeCpfCnpj(value: string) {
  return onlyDigits(value);
}
