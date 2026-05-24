import { useState }               from "react";
import { ArrowBack, Add, PictureAsPdf } from "@mui/icons-material";
import { usePacientesHC, useHistoriaDetalle } from "../../../Hook/useHistoriaClinica";
import { generarPDFHistoriaCompleta }         from "./HistoriaClinicaPDF";
import { alert, hcColors }                    from "../../../components/historiaclinica/historiaClinicaStyles";
import PatientCard from "../../../components/historiaclinica/PatientCard"
import HCHeader    from "../../../components/historiaclinica/Hcheader";
import FormRegister from "../../../components/historiaclinica/FormRegister";
import RegisterCard from "../../../components/historiaclinica/RegisterCard";

// ── Vista: lista de pacientes ─────────────────────────────────────────────────
function ListaPacientes({ doctorId, onSelect }) {
  const { pacientes, loading } = usePacientesHC(doctorId);
  const [search, setSearch] = useState("");

  // ✅ Filtro derivado puro — sin SearchBar, sin loop infinito
  const filtered = pacientes.filter(p => {
    const q = search.toLowerCase();
    return !q || p.pname?.toLowerCase().includes(q) || p.pemail?.toLowerCase().includes(q);
  });
 
  if (loading) return <p style={{ color: hcColors.muted }}>Cargando pacientes...</p>;
 
  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.3rem", color: hcColors.text }}>Historias Clínicas</h2>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: hcColors.muted }}>
          Resolución 1995 de 1999 — Ministerio de Salud Colombia
        </p>
      </div>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar paciente..."
        style={{
          width: "100%", padding: "0.6rem 1rem", fontSize: "14px",
          border: "1px solid var(--bordercolor)", borderRadius: "8px",
          outline: "none", boxSizing: "border-box", color: hcColors.text,
          marginBottom: "1rem",
        }}
      />
      {filtered.length === 0 ? (
        <p style={{ color: hcColors.muted, textAlign: "center", padding: "2rem" }}>
          {search ? "No hay coincidencias." : "No tienes pacientes con citas registradas."}
        </p>
      ) : (
        filtered.map(p => (
          <div key={p.pid} style={{ marginBottom: "10px" }}>
            <PatientCard paciente={p} onClick={() => onSelect(p)} />
          </div>
        ))
      )}
    </div>
  );
}
 

function VistaHistoria({ paciente, doctorId, onBack }) {
  const { historia, registros, loading, msg, guardarRegistro, anular } =
    useHistoriaDetalle(paciente.pid, doctorId);
  const [showForm, setShowForm] = useState(false);
 
  const activos = registros.filter(r => !r.anulado);
 
  if (loading) return <p style={{ color: hcColors.muted }}>Cargando historia clínica...</p>;
 
  return (
    <div>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", color: hcColors.primary, fontSize: "13px", marginBottom: "1.25rem", padding: 0 }}>
        <ArrowBack fontSize="small" /> Volver
      </button>
 
      {msg && <div style={alert(msg.type)}>{msg.text}</div>}
 
      <HCHeader historia={historia} totalActivos={activos.length} />
 
      {!showForm && (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginBottom: "1rem" }}>
          {activos.length > 0 && (
            <button onClick={() => generarPDFHistoriaCompleta(historia, activos)} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#fff", color: "#C62828", border: "1px solid #FFCDD2", borderRadius: "8px", padding: "0.6rem 1.25rem", cursor: "pointer", fontSize: "13px" }}>
              <PictureAsPdf fontSize="small" /> Descargar HC completa
            </button>
          )}
          <button onClick={() => setShowForm(true)} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: hcColors.primary, color: "#fff", border: "none", borderRadius: "8px", padding: "0.6rem 1.25rem", cursor: "pointer", fontSize: "13px" }}>
            <Add fontSize="small" /> Nuevo registro
          </button>
        </div>
      )}
 
      {showForm && historia && (
        <div style={{ marginBottom: "1rem" }}>
          <FormRegister
            hcId={historia.hc_id}
            doctorId={doctorId}
            onSaved={async (data) => { const res = await guardarRegistro(data); if (res.status === "success") setShowForm(false); return res; }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
 
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {registros.length === 0
          ? <p style={{ color: hcColors.muted, textAlign: "center", padding: "2rem" }}>No hay registros clínicos aún.</p>
          : registros.map(r => (
              <RegisterCard key={r.registro_id} registro={r} historia={historia}
                onAnular={(id, motivo) => anular(id, motivo)} />
            ))}
      </div>
    </div>
  );
}
 
// ── Componente raíz ───────────────────────────────────────────────────────────
function HistoriaClinica({ doctorId }) {
  const [selected, setSelected] = useState(null);
 
  return selected
    ? <VistaHistoria paciente={selected} doctorId={doctorId} onBack={() => setSelected(null)} />
    : <ListaPacientes doctorId={doctorId} onSelect={setSelected} />;
}
 
export default HistoriaClinica;