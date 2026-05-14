// src/pages/doctor/historiaClinica/components/HCHeader.jsx
import { MedicalServices } from "@mui/icons-material";
import { cardBlue, hcColors } from "./historiaClinicaStyles";

function HCHeader({ historia, totalActivos }) {
  if (!historia) return null;
  return (
    <div style={{ ...cardBlue, marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <MedicalServices style={{ color: hcColors.primary }} />
            <h3 style={{ margin: 0, fontSize: "1rem", color: hcColors.primary }}>Historia Clínica</h3>
            <span style={{ fontSize: "11px", color: hcColors.muted }}>HC-{historia.hc_id}</span>
          </div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: "15px", color: hcColors.text }}>{historia.paciente}</p>
          <p style={{ margin: "3px 0 0", fontSize: "12px", color: hcColors.muted }}>
            {historia.tipo_documento}: {historia.pdocument ?? "—"} · Nac: {historia.pbirthdate ?? "—"} · Tel: {historia.pphone ?? "—"}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: "12px", color: hcColors.muted }}>
            {historia.paddress ?? "—"} · {historia.pemail}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: "11px", color: hcColors.muted }}>Apertura</p>
          <p style={{ margin: 0, fontWeight: 600, fontSize: "13px", color: hcColors.text }}>{historia.fecha_apertura}</p>
          <p style={{ margin: "4px 0 0", fontSize: "11px", color: hcColors.muted }}>{totalActivos} registro(s) activo(s)</p>
        </div>
      </div>
    </div>
  );
}

export default HCHeader;