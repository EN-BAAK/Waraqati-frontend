export const handlePhoneCall = (phoneNumber: string) => {
  if (!phoneNumber) return;

  const sanitizedNumber = phoneNumber.replace(/\s|-/g, "");

  window.location.href = `tel:${sanitizedNumber}`;
};

export const setSessionItem = (key: string, value: unknown): void => {
  if (typeof window === "undefined") return;
  try {
    const data = typeof value === "string" ? value : JSON.stringify(value);
    sessionStorage.setItem(key, data);
  } catch { }
};

export const getSessionItem = <T = unknown>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  try {
    const item = sessionStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch {
    return null;
  }
};

export const clearSessionItem = (key: string): void => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(key);
};

export const searchText = (search: string, text: string): boolean => {
  const re = new RegExp("\\w*" + search + "\\w*", "ig");
  return re.test(text);
};

export const wait = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const formatBalance = (value: number): string => {
  const removeTrailingZeros = (num: number): string => {
    return num % 1 === 0 ? num.toString() : num.toFixed(1);
  };

  if (value < 1000) {
    return `${value.toFixed(2)}$`;
  }

  if (value < 1_000_000) {
    const formatted = value / 1000;
    return `${removeTrailingZeros(formatted)}k$`;
  }

  const formatted = value / 1_000_000;
  return `${removeTrailingZeros(formatted)}m$`;
};