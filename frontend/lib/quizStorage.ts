const KEY = "resumeQuizState";

export function loadQuizState() {
  const raw = typeof window !== "undefined" ? sessionStorage.getItem(KEY) : null;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    sessionStorage.removeItem(KEY);
    return null;
  }
}

export function saveQuizState(obj: any) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(obj));
  } catch (e) {
    // ignore
  }
}

export function clearQuizState() {
  sessionStorage.removeItem(KEY);
}
