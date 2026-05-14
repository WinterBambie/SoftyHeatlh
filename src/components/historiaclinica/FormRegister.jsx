import { useState } from "react";
import { COLORS, inputStyle, labelStyle } from "../../styles/COLORS";
import { card, sectionTitle, primaryBtn, hcColors } from "./historiaClinicaStyles";

const FORM_INITIAL = {
  motivo_consulta: "", anamnesis: "", examen_fisico: "",
  diagnostico: "", cie10_codigo: "", plan_manejo: "",
  evolucion: "", observaciones: "",
  presion_arterial: "", frecuencia_cardiaca: "", frecuencia_respiratoria: "",
  temperatura: "", peso_kg: "", talla_cm: "", saturacion_o2: "",
};

const SIGNOS = [
  ["presion_arterial",        "T.A. (mmHg)"],
  ["frecuencia_cardiaca",     "FC (lpm)"],
  ["frecuencia_respiratoria", "FR (rpm)"],
  ["temperatura",             "Temp (°C)"],
  ["peso_kg",                 "Peso (kg)"],
  ["talla_cm",                "Talla (cm)"],
  ["saturacion_o2",           "SatO₂ (%)"],
];

function Field({ name, label, required, rows, form, onChange }) {
  return (
    <div>
      <label style={labelStyle}>{label}{required ? " *" : ""}</label>
      {rows
        ? <textarea name={name} value={form[name]} onChange={onChange} rows={rows}
            style={{ ...inputStyle, resize: "vertical" }} />
        : <input name={name} value={form[name]} onChange={onChange} style={inputStyle} />}
    </div>
  );
}

function FormRegistro({ hcId, doctorId, onSaved, onCancel }) {
  const [form,    setForm]    = useState(FORM_INITIAL);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.motivo_consulta || !form.diagnostico || !form.plan_manejo) {
      setError("Motivo de consulta, diagnóstico y plan de manejo son obligatorios."); return;
    }
    setError(""); setLoading(true);
    const res = await onSaved({ ...form, hc_id: hcId, doctor_id: doctorId });
    if (res?.status !== "success") setError(res?.message || "Error al guardar.");
    setLoading(false);
  };

  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h3 style={{ margin: 0, fontSize: "1rem", color: hcColors.text }}>Nuevo registro clínico</h3>
        <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: hcColors.muted, fontSize: "13px" }}>
          Cancelar
        </button>
      </div>

      {error && (
        <div style={{ backgroundColor: "#FFEBEE", border: "1px solid #FFCDD2", borderRadius: "8px", padding: "0.75rem", marginBottom: "1rem", fontSize: "13px", color: "#C62828" }}>
          {error}
        </div>
      )}

      <p style={sectionTitle}>Signos vitales</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
        {SIGNOS.map(([name, label]) => (
          <Field key={name} name={name} label={label} form={form} onChange={handle} />
        ))}
      </div>

      <p style={sectionTitle}>Anamnesis</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <Field name="motivo_consulta" label="Motivo de consulta" required rows={3} form={form} onChange={handle} />
        <Field name="anamnesis"       label="Historia de la enfermedad actual" rows={4} form={form} onChange={handle} />
        <Field name="examen_fisico"   label="Examen físico" rows={4} form={form} onChange={handle} />
      </div>

      <p style={sectionTitle}>Diagnóstico y plan</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <Field name="diagnostico" label="Diagnóstico" required rows={2} form={form} onChange={handle} />
        </div>
        <Field name="cie10_codigo" label="Código CIE-10" form={form} onChange={handle} />
        <div />
        <div style={{ gridColumn: "1 / -1" }}>
          <Field name="plan_manejo"   label="Plan de manejo / Tratamiento" required rows={3} form={form} onChange={handle} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <Field name="evolucion"     label="Evolución del paciente" rows={3} form={form} onChange={handle} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <Field name="observaciones" label="Observaciones" rows={2} form={form} onChange={handle} />
        </div>
      </div>

      <p style={{ fontSize: "11px", color: hcColors.muted, margin: "1rem 0 0", fontStyle: "italic" }}>
        * Una vez guardado no puede modificarse — solo anularse con justificación (Art. 18, Res. 1995/1999)
      </p>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
        <button onClick={handleSubmit} disabled={loading} style={primaryBtn(loading)}>
          {loading ? "Guardando..." : "Guardar registro"}
        </button>
      </div>
    </div>
  );
}

export default FormRegistro;