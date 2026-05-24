// src/Hook/useHistoriaClinica.js
import { useState, useEffect, useCallback } from "react";
import {
  getPacientesHC,
  getHistoriaClinica,
  crearRegistroClinico,
  anularRegistro,
} from "../services/historiaclinicaService";

// ── Parsear signos_vitales de string JSON a objeto ────────────────────────────
const parseRegistros = (registros = []) =>
  registros.map(r => ({
    ...r,
    signos_vitales: r.signos_vitales
      ? (typeof r.signos_vitales === "string"
          ? JSON.parse(r.signos_vitales)
          : r.signos_vitales)
      : null,
  }));

// ── Hook: lista de pacientes del doctor ───────────────────────────────────────
export function usePacientesHC(doctorId) {
  const [pacientes, setPacientes] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    getPacientesHC(doctorId)
      .then(res => { if (res.status === "success") setPacientes(res.data ?? []); })
      .finally(() => setLoading(false));
  }, [doctorId]);

  return { pacientes, loading };
}

// ── Hook: detalle de historia clínica de un paciente ─────────────────────────
export function useHistoriaDetalle(pid, doctorId) {
  const [historia,  setHistoria]  = useState(null);
  const [registros, setRegistros] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [msg,       setMsg]       = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getHistoriaClinica(pid, doctorId);
    if (res.status === "success") {
      setHistoria(res.data.historia);
      setRegistros(parseRegistros(res.data.registros ?? []));
    } else {
      setMsg({ type: "error", text: res.message || "Error al cargar la historia clínica." });
    }
    setLoading(false);
  }, [pid, doctorId]);

  useEffect(() => { load(); }, [load]);

  // Guardar nuevo registro — devuelve el resultado para que el componente reaccione
  const guardarRegistro = async (formData) => {
    const res = await crearRegistroClinico({ ...formData, doctor_id: doctorId });
    if (res.status === "success") {
      setMsg({ type: "success", text: "Registro guardado correctamente." });
      await load();
    } else {
      setMsg({ type: "error", text: res.message || "Error al guardar." });
    }
    return res;
  };

  // Anular registro existente
  const anular = async (registro_id, motivo) => {
    const res = await anularRegistro(registro_id, doctorId, motivo);
    if (res.status === "success") {
      setMsg({ type: "success", text: "Registro anulado." });
      await load();
    } else {
      setMsg({ type: "error", text: res.message || "Error al anular." });
    }
    return res;
  };

  return { historia, registros, loading, msg, setMsg, guardarRegistro, anular, reload: load };
}