import { useState, useEffect } from "react";
import { Delete, Visibility } from "@mui/icons-material";
//import { getAdminPatients } from "../../services/adminService";
import {deletePatient} from "../../services/patientService"
import { COLORS, cardStyle } from "../../styles/COLORS";
import SearchBar from "../../components/dashboard/Searchbar";

const iconBtn = (color, bg, border) => ({
  display: "flex", alignItems: "center", justifyContent: "center",
  width: "32px", height: "32px", borderRadius: "8px",
  border: `1px solid ${border}`, backgroundColor: bg, color,
  cursor: "pointer",
});

function AdminPatients({ patients = [], onRefresh }) {
  const [filtered, setFiltered] = useState(patients);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");
  const [selected, setSelected] = useState(null); // paciente en modal de detalle

  useEffect(() => { setFiltered(patients); }, [patients]);

  const handleDelete = async (pid) => {
    if (!window.confirm("¿Eliminar este paciente? Se eliminarán también sus citas.")) return;
    const res = await deletePatient(pid);
    if (res?.status === "success") { setSuccess("✓ Paciente eliminado."); onRefresh(); }
    else setError(res?.message || "Error al eliminar.");
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h3 style={{ margin: 0, fontSize: "1rem", color: COLORS.text }}>Pacientes ({patients.length})</h3>
      </div>

      {error   && <div style={{ backgroundColor: "#FFEBEE", border: "1px solid #FFCDD2", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "13px", color: "#C62828" }}>{error}</div>}
      {success && <div style={{ backgroundColor: "#E8F5E9", border: "1px solid #A5D6A7", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "13px", color: "#2E7D32" }}>{success}</div>}

      <div style={{ marginBottom: "1rem" }}>
        <SearchBar data={patients} keys={["pname", "pemail", "pphone"]} onResults={setFiltered}
          placeholder="Buscar por nombre, correo o teléfono..."
          renderItem={p => (
            <div>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 500 }}>{p.pname}</p>
              <p style={{ margin: "2px 0 0", fontSize: "12px", color: COLORS.muted }}>{p.pemail}</p>
            </div>
          )}
        />
      </div>

      {filtered.length === 0
        ? <p style={{ color: COLORS.muted, fontSize: "14px" }}>No hay pacientes registrados.</p>
        : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: COLORS.btnBg }}>
                {["#", "Nombre", "Correo", "Teléfono", "Dirección", "Acciones"].map(h => (
                  <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", color: COLORS.btnText, fontWeight: 500, fontSize: "13px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.pid} style={{ borderBottom: `1px solid ${COLORS.border}`, backgroundColor: i % 2 === 0 ? "#fff" : COLORS.gray }}>
                  <td style={{ padding: "0.75rem 1rem", color: COLORS.muted }}>{p.pid}</td>
                  <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{p.pname}</td>
                  <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{p.pemail}</td>
                  <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{p.pphone || "—"}</td>
                  <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{p.paddress || "—"}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => setSelected(p)} title="Ver detalle" style={iconBtn("#1565C0", "#E3F2FD", "#BBDEFB")}>
                        <Visibility style={{ fontSize: "16px" }} />
                      </button>
                      <button onClick={() => handleDelete(p.pid)} title="Eliminar" style={iconBtn("#C62828", "#FFEBEE", "#FFCDD2")}>
                        <Delete style={{ fontSize: "16px" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      {/* Modal detalle paciente */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            backgroundColor: "#fff", borderRadius: "12px", padding: "1.5rem",
            width: "400px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", color: COLORS.text }}>Detalle del paciente</h3>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: COLORS.muted }}>✕</button>
            </div>
            {[
              ["Nombre",    selected.pname],
              ["Correo",    selected.pemail],
              ["Teléfono",  selected.pphone  || "—"],
              ["Dirección", selected.paddress || "—"],
              ["Fecha nac.", selected.pbirthdate || "—"],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontSize: "13px", color: COLORS.muted }}>{label}</span>
                <span style={{ fontSize: "13px", color: COLORS.text, fontWeight: 500 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPatients;