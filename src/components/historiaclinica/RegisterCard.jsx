// src/pages/doctor/historiaClinica/components/RegistroCard.jsx
import { useState } from "react";
import { Block, PictureAsPdf } from "@mui/icons-material";
import { card, iconBtn, hcColors, alert } from "./historiaClinicaStyles";
import { inputStyle } from "../../styles/COLORS";
import SignosVitales from "./SignosVitales";
import { generarPDFRegistro } from "../../pages/doctor/HistoriaClinica/HistoriaClinicaPDF";

const CAMPOS_TEXTO = [
  ["MOTIVO DE CONSULTA",  "motivo_consulta"],
  ["ANAMNESIS",           "anamnesis"],
  ["EXAMEN FÍSICO",       "examen_fisico"],
  ["PLAN DE MANEJO",      "plan_manejo"],
  ["EVOLUCIÓN",           "evolucion"],
  ["OBSERVACIONES",       "observaciones"],
];

function RegisterCard({ registro: r, historia, onAnular }) {
  const [expanded,    setExpanded]    = useState(false);
  const [anulando,    setAnulando]    = useState(false);
  const [motivo,      setMotivo]      = useState("");
  const [loadingAnul, setLoadingAnul] = useState(false);

  const handleAnular = async () => {
    if (!motivo.trim()) return;
    setLoadingAnul(true);
    await onAnular(r.registro_id, motivo);
    setLoadingAnul(false);
    setAnulando(false);
    setMotivo("");
  };

  const diagnosticoCompleto = r.diagnostico + (r.cie10_codigo ? ` (CIE-10: ${r.cie10_codigo})` : "");

  return (
    <div style={{ ...card, opacity: r.anulado ? 0.6 : 1, borderLeft: `4px solid ${r.anulado ? "#C62828" : hcColors.primary}` }}>

      {/* Header — siempre visible */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
        onClick={() => setExpanded(e => !e)}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: "14px", color: hcColors.text }}>
              {r.fecha_registro} — {r.hora_registro?.slice(0, 5)}
            </p>
            {r.anulado && (
              <span style={{ backgroundColor: "#FFEBEE", color: "#C62828", padding: "2px 8px", borderRadius: "12px", fontSize: "11px" }}>
                ANULADO
              </span>
            )}
          </div>
          <p style={{ margin: "2px 0 0", fontSize: "12px", color: hcColors.muted }}>
            Dr. {r.doctor_nombre} · {r.motivo_consulta?.slice(0, 70)}{r.motivo_consulta?.length > 70 ? "..." : ""}
          </p>
        </div>
        <span style={{ fontSize: "16px", color: hcColors.muted }}>{expanded ? "▲" : "▼"}</span>
      </div>

      {/* Detalle — expandible */}
      {expanded && (
        <div style={{ marginTop: "1rem", borderTop: "1px solid var(--bordercolor)", paddingTop: "1rem" }}>

          {r.anulado && (
            <div style={alert("error")}>
              <strong>Anulado</strong> por {r.anulado_por_nombre} el {r.anulado_at?.slice(0, 10)}
              <br />Motivo: {r.motivo_anulacion}
            </div>
          )}

          <SignosVitales signos={r.signos_vitales} />

          {/* Diagnóstico destacado */}
          <div style={{ marginBottom: "0.75rem" }}>
            <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: "11px", color: hcColors.primary }}>DIAGNÓSTICO</p>
            <p style={{ margin: 0, fontSize: "13px", color: hcColors.text }}>{diagnosticoCompleto}</p>
          </div>

          {/* Resto de campos */}
          {CAMPOS_TEXTO.filter(([, key]) => r[key]).map(([title, key]) => (
            <div key={key} style={{ marginBottom: "0.75rem" }}>
              <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: "11px", color: hcColors.primary }}>{title}</p>
              <p style={{ margin: 0, fontSize: "13px", color: hcColors.text, whiteSpace: "pre-wrap" }}>{r[key]}</p>
            </div>
          ))}

          {/* Acciones */}
          {!r.anulado && (
            <div style={{ display: "flex", gap: "8px", marginTop: "1rem" }}>
              <button onClick={() => generarPDFRegistro(historia, r)}
                style={iconBtn("#E3F2FD", "#1565C0", "#BBDEFB")}>
                <PictureAsPdf style={{ fontSize: "14px" }} /> Descargar
              </button>
              {!anulando && (
                <button onClick={() => setAnulando(true)}
                  style={iconBtn("#FFEBEE", "#C62828", "#FFCDD2")}>
                  <Block style={{ fontSize: "14px" }} /> Anular
                </button>
              )}
            </div>
          )}

          {/* Formulario de anulación */}
          {anulando && (
            <div style={{ marginTop: "1rem", backgroundColor: "#FFF3E0", borderRadius: "8px", padding: "1rem" }}>
              <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#E65100", fontWeight: 500 }}>Motivo de anulación *</p>
              <textarea value={motivo} onChange={e => setMotivo(e.target.value)} rows={3}
                style={{ ...inputStyle, width: "100%", resize: "vertical", boxSizing: "border-box" }}
                placeholder="Describe el motivo..." />
              <div style={{ display: "flex", gap: "8px", marginTop: "0.75rem" }}>
                <button onClick={handleAnular} disabled={loadingAnul || !motivo.trim()}
                  style={{ backgroundColor: "#C62828", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 14px", cursor: "pointer", fontSize: "12px", opacity: loadingAnul ? 0.7 : 1 }}>
                  {loadingAnul ? "Anulando..." : "Confirmar"}
                </button>
                <button onClick={() => { setAnulando(false); setMotivo(""); }}
                  style={{ backgroundColor: "#fff", color: hcColors.text, border: "1px solid var(--bordercolor)", borderRadius: "6px", padding: "6px 14px", cursor: "pointer", fontSize: "12px" }}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RegisterCard;