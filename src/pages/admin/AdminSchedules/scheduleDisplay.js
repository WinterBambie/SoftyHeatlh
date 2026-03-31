/** Nombres de día: API usa 0=lunes … 6=domingo (mismo criterio que citas). */
export const DAYS_MAP = {
  0: "Lunes",
  1: "Martes",
  2: "Miércoles",
  3: "Jueves",
  4: "Viernes",
  5: "Sábado",
  6: "Domingo",
};

export function scheduleDayLabel(sc) {
  if (sc.day_of_week === undefined || sc.day_of_week === null || sc.day_of_week === "") {
    return sc.scheduledate || "—";
  }
  const n = Number(sc.day_of_week);
  return DAYS_MAP[n] ?? String(sc.day_of_week);
}

export function scheduleTimeRange(sc) {
  if (sc.start_time && sc.end_time) return `${sc.start_time} – ${sc.end_time}`;
  return sc.scheduletime || "—";
}

export function scheduleMaxPatients(sc) {
  const v = sc.max_patients ?? sc.max_patients_per_day;
  return v !== undefined && v !== null ? v : "—";
}

export function scheduleReserved(sc) {
  const r = sc.reserved ?? sc.booked ?? 0;
  return Number(r) || 0;
}

/** "HH:MM" o "HH:MM:SS" → minutos desde medianoche */
export function timeToMinutes(t) {
  if (!t && t !== 0) return 0;
  const parts = String(t).trim().split(":");
  const h = Number(parts[0]) || 0;
  const m = Number(parts[1]) || 0;
  return h * 60 + m;
}
