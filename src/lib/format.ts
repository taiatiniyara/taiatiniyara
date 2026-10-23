export const fmtDate = (sec: number | null) => (sec ? new Date(sec * 1000).toISOString().slice(0, 10) : "");
export const xml = (s: string) => s.replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`);
