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