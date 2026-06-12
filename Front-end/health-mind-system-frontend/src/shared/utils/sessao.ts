import { DisponibilidadeDTO } from "../types/dtos/Disponibilidade.dto";
import { SessaoDTO } from "../types/dtos/Sessao.dto";

const DATE_KEY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})/;

export function extractDateKey(value: string | Date): string {
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

export function formatDateLabel(dateKey: string): string {
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

export function formatTimeLabel(value: string): string {
  if (!value) {
    return "--:--";
  }

  return value.slice(0, 5);
}

// Combina a data com o horário de início para obter o instante real da disponibilidade.
export function getDataHoraDisponibilidade(disponibilidade: DisponibilidadeDTO): Date {
  const dataHoraDisponibilidade = new Date(disponibilidade.dataDisponibilidade);
  const [hora, minuto] = formatTimeLabel(disponibilidade.horaInicio).split(":").map(Number);

  dataHoraDisponibilidade.setHours(hora, minuto, 0, 0);

  return dataHoraDisponibilidade;
}

// Indica se a disponibilidade (data + hora) é posterior ao momento atual.
export function isDisponibilidadeFutura(disponibilidade: DisponibilidadeDTO): boolean {
  return getDataHoraDisponibilidade(disponibilidade) > new Date();
}

// Combina a data com o horário de início para obter o instante real da sessão.
// Usa a chave de data literal (YYYY-MM-DD) para não sofrer deslocamento de fuso,
// de forma consistente com formatDateLabel e o filtro de agendamentos.
export function getDataHoraSessao(sessao: SessaoDTO): Date {
  const [ano, mes, dia] = extractDateKey(sessao.dataSessao).split("-").map(Number);
  const [hora, minuto] = formatTimeLabel(sessao.horaInicio).split(":").map(Number);

  return new Date(ano, mes - 1, dia, hora || 0, minuto || 0, 0, 0);
}

// Indica se a sessão (data + hora) já passou em relação ao momento atual.
export function isSessaoPassada(sessao: SessaoDTO): boolean {
  const dataHoraSessao = getDataHoraSessao(sessao);
  return !Number.isNaN(dataHoraSessao.getTime()) && dataHoraSessao < new Date();
}

export function groupSessoesByDate(sessoes: SessaoDTO[]): Record<string, SessaoDTO[]> {
  return sessoes.reduce<Record<string, SessaoDTO[]>>((acc, sessao) => {
    const key = extractDateKey(sessao.dataSessao);

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(sessao);
    return acc;
  }, {});
}

export function sortSessoesByDateAndTime(sessoes: SessaoDTO[]): SessaoDTO[] {
  return [...sessoes].sort((left, right) => {
    const leftKey = `${extractDateKey(left.dataSessao)}T${formatTimeLabel(left.horaInicio)}`;
    const rightKey = `${extractDateKey(right.dataSessao)}T${formatTimeLabel(right.horaInicio)}`;

    return leftKey.localeCompare(rightKey);
  });
}

export function getDiaSemana(data: string | Date): string {
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