// src/pages/doctor/historiaClinica/components/PacienteCard.jsx
import { Person } from "@mui/icons-material";
import { card, pill, hcColors } from "./historiaClinicaStyles";

function PatientCard({ paciente, onClick }) {
  return (
    <div onClick={onClick} style={{
      ...card, display: "flex", justifyContent: "space-between",
      alignItems: "center", cursor: "pointer", transition: "box-shadow 0.15s",
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"}
    >
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <div style={{ width: "42px", height: "42px", borderRadius: "50%", backgroundColor: "#E8F0FE", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Person style={{ color: hcColors.primary, fontSize: "20px" }} />
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 500, fontSize: "14px", color: hcColors.text }}>{paciente.pname}</p>
          <p style={{ margin: "2px 0 0", fontSize: "12px", color: hcColors.muted }}>
            {paciente.pbirthdate ? `Nac: ${paciente.pbirthdate} · ` : ""}{paciente.pemail}
          </p>
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        {paciente.hc_id ? (
          <>
            <span style={pill("#E8F5E9", "#2E7D32")}>HC abierta</span>
            <p style={{ margin: "4px 0 0", fontSize: "11px", color: hcColors.muted }}>
              {paciente.total_registros} registro{paciente.total_registros !== 1 ? "s" : ""}
              {paciente.ultima_consulta ? ` · última: ${paciente.ultima_consulta}` : ""}
            </p>
          </>
        ) : (
          <span style={pill("#FFF3E0", "#E65100")}>Sin HC</span>
        )}
      </div>
    </div>
  );
}

export default PatientCard;