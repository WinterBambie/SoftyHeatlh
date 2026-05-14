// src/pages/doctor/historiaClinica/components/SignosVitales.jsx
import { hcColors } from "./historiaClinicaStyles";

const CAMPOS = [
  ["T.A.",   "presion_arterial",        ""],
  ["FC",     "frecuencia_cardiaca",     " lpm"],
  ["FR",     "frecuencia_respiratoria", " rpm"],
  ["T°",     "temperatura",             "°C"],
  ["Peso",   "peso_kg",                 " kg"],
  ["Talla",  "talla_cm",               " cm"],
  ["SatO₂",  "saturacion_o2",          "%"],
];

function SignosVitales({ signos }) {
  if (!signos || !Object.values(signos).some(v => v)) return null;
  const activos = CAMPOS.filter(([, key]) => signos[key]);

  return (
    <div style={{ marginBottom: "1rem" }}>
      <p style={{ margin: "0 0 6px", fontWeight: 600, fontSize: "11px", color: hcColors.primary }}>
        SIGNOS VITALES
      </p>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {activos.map(([label, key, unit]) => (
          <span key={key} style={{
            fontSize: "12px", backgroundColor: "#E8F0FE",
            color: hcColors.primary, padding: "4px 10px", borderRadius: "6px",
          }}>
            <strong>{label}:</strong> {signos[key]}{unit}
          </span>
        ))}
      </div>
    </div>
  );
}

export default SignosVitales;