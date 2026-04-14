import { useState, useEffect } from "react";
import { Edit, Delete } from "@mui/icons-material";
import { getDocumentTypes, createDoctor, updateDoctor, deleteDoctor } from "../../services/adminService";
import { COLORS, inputStyle, labelStyle, cardStyle } from "../../styles/COLORS";
import SearchBar from "../../components/dashboard/Searchbar";
import usePasswordValidation from "../../Hook/usePasswordValidation";

const FORM_INITIAL = {
  dname: "", demail: "", dpassword: "", dphone: "",
  ddocument: "", tipo_documento_id: "", specialty_name: "",
};

const iconBtn = (color, bg, border) => ({
  display: "flex", alignItems: "center", justifyContent: "center",
  width: "32px", height: "32px", borderRadius: "8px",
  border: `1px solid ${border}`, backgroundColor: bg, color,
  cursor: "pointer",
});

function AdminDoctors({ doctors = [], onRefresh }) {
  const [showForm,  setShowForm]  = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [docTypes,  setDocTypes]  = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState("");
  const [form,      setForm]      = useState(FORM_INITIAL);
  const [filtered,  setFiltered]  = useState(doctors);

  const { rules, isValid } = usePasswordValidation(form.dpassword);

  useEffect(() => {
    getDocumentTypes().then(res => {
      if (Array.isArray(res)) setDocTypes(res);
      else if (res?.data) setDocTypes(res.data);
    });
  }, []);

  useEffect(() => { setFiltered(doctors); }, [doctors]);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleEdit = (d) => {
    setForm({
      dname: d.dname, demail: d.demail, dpassword: "",
      dphone: d.dphone ?? "", ddocument: d.ddocument ?? "",
      tipo_documento_id: d.tipo_documento_id ?? "",
      specialty_name: d.specialty ?? "",
    });
    setEditing(d.docid);
    setShowForm(true);
    setError(""); setSuccess("");
  };

  const handleDelete = async (docid) => {
    if (!window.confirm("¿Eliminar este doctor? Se eliminarán también sus horarios y citas.")) return;
    const res = await deleteDoctor(docid);
    if (res?.status === "success") { setSuccess("✓ Doctor eliminado."); onRefresh(); }
    else setError(res?.message || "Error al eliminar.");
  };

  const handleCancel = () => {
    setShowForm(false); setEditing(null);
    setForm(FORM_INITIAL); setError("");
  };

  const handleSubmit = async () => {
    setError(""); setSuccess("");
    if (!form.dname || !form.demail) { setError("Nombre y correo son obligatorios."); return; }
    if (!editing && !isValid) { setError("La contraseña no cumple los requisitos."); return; }

    setLoading(true);
    try {
      let res;
      if (editing) {
        const data = { dname: form.dname, demail: form.demail, dphone: form.dphone };
        console.log("→ updateDoctor llamado con docid:", editing, "data:", data);
        res = await updateDoctor(editing, data);
        console.log("→ respuesta updateDoctor:", JSON.stringify(res));
      } else {
        if (!form.ddocument || !form.specialty_name) {
          setError("Completa todos los campos obligatorios."); setLoading(false); return;
        }
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        console.log("→ createDoctor llamado");
        res = await createDoctor(fd);
        console.log("→ respuesta createDoctor:", JSON.stringify(res));
      }
      console.log("→ res.status:", res?.status);
      if (res?.status === "success") {
        setSuccess(editing ? "✓ Doctor actualizado." : "✓ Doctor registrado.");
          setTimeout(() => setSuccess(""), 3000);
        handleCancel(); onRefresh();
      } else setError(res?.message || "Error al guardar.");
    } catch (err) {
      console.error( err);
      setError(err?.message || "Error desconocido");
    } finally { setLoading(false); }
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h3 style={{ margin: 0, fontSize: "1rem", color: COLORS.text }}>Doctores ({doctors.length})</h3>
        <button onClick={() => showForm ? handleCancel() : setShowForm(true)} style={{
          backgroundColor: showForm ? "#f5f7fa" : COLORS.primary,
          color: showForm ? COLORS.text : "#fff",
          border: showForm ? `1px solid ${COLORS.border}` : "none",
          borderRadius: "8px", padding: "0.5rem 1rem", cursor: "pointer", fontSize: "13px",
        }}>
          {showForm ? "Cancelar" : "+ Registrar doctor"}
        </button>
      </div>

      {error   && <div style={{ backgroundColor: "#FFEBEE", border: "1px solid #FFCDD2", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "13px", color: "#C62828" }}>{error}</div>}
      {success && <div style={{ backgroundColor: "#E8F5E9", border: "1px solid #A5D6A7", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "13px", color: "#2E7D32" }}>{success}</div>}

      {showForm && (
        <div style={{ backgroundColor: COLORS.gray, borderRadius: "10px", padding: "1.25rem", marginBottom: "1.5rem", border: `1px solid ${COLORS.border}` }}>
          <h4 style={{ margin: "0 0 1rem", fontSize: "14px", color: COLORS.text }}>
            {editing ? "Editar doctor" : "Nuevo doctor"}
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div><label style={labelStyle}>Nombre completo *</label>
              <input name="dname" value={form.dname} onChange={handle} style={inputStyle} placeholder="Ej: Dr. Juan Pérez" /></div>
            <div><label style={labelStyle}>Correo electrónico *</label>
              <input name="demail" type="email" value={form.demail} onChange={handle} style={inputStyle} placeholder="doctor@email.com" /></div>
            {!editing && <>
              <div>
                <label style={labelStyle}>Contraseña *</label>
                <input name="dpassword" type="password" value={form.dpassword} onChange={handle} style={inputStyle} placeholder="Contraseña" />
                {form.dpassword && (
                  <div style={{ marginTop: "6px" }}>
                    {rules.map((r, i) => (
                      <p key={i} style={{ margin: "2px 0", fontSize: "11px", color: r.test ? "#2E7D32" : "#C62828" }}>
                        {r.test ? "✓" : "✗"} {r.msg}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div><label style={labelStyle}>Teléfono</label>
                <input name="dphone" value={form.dphone} onChange={handle} style={inputStyle} placeholder="Ej: 3001234567" /></div>
              <div><label style={labelStyle}>Tipo de documento *</label>
                <select name="tipo_documento_id" value={form.tipo_documento_id} onChange={handle} style={inputStyle}>
                  <option value="">Seleccionar...</option>
                  {docTypes.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
                </select></div>
              <div><label style={labelStyle}>Número de documento *</label>
                <input name="ddocument" value={form.ddocument} onChange={handle} style={inputStyle} placeholder="Ej: 12345678" /></div>
              <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Especialidad *</label>
                <input name="specialty_name" value={form.specialty_name} onChange={handle} style={inputStyle} placeholder="Ej: Cardiología" /></div>
            </>}
            {editing && <>
              <div><label style={labelStyle}>Teléfono</label>
                <input name="dphone" value={form.dphone} onChange={handle} style={inputStyle} /></div>
            </>}
          </div>
          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
            <button onClick={handleCancel} style={{ backgroundColor: "#fff", color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: "8px", padding: "0.6rem 1.25rem", cursor: "pointer", fontSize: "14px" }}>Cancelar</button>
            <button onClick={handleSubmit} disabled={loading} style={{ backgroundColor: COLORS.primary, color: "#fff", border: "none", borderRadius: "8px", padding: "0.6rem 1.5rem", cursor: loading ? "not-allowed" : "pointer", fontSize: "14px", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Guardando..." : editing ? "Actualizar" : "Registrar doctor"}
            </button>
          </div>
        </div>
      )}

      <div style={{ marginBottom: "1rem" }}>
        <SearchBar data={doctors} keys={["dname", "demail", "specialty"]} onResults={setFiltered}
          placeholder="Buscar por nombre, correo o especialidad..."
          renderItem={d => (
            <div>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 500 }}>{d.dname}</p>
              <p style={{ margin: "2px 0 0", fontSize: "12px", color: COLORS.muted }}>{d.demail} · {d.specialty || "Sin especialidad"}</p>
            </div>
          )}
        />
      </div>

      {filtered.length === 0
        ? <p style={{ color: COLORS.muted, fontSize: "14px" }}>No hay doctores registrados.</p>
        : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: COLORS.btnBg }}>
                {["#", "Nombre", "Correo", "Teléfono", "Especialidad", "Acciones"].map(h => (
                  <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", color: COLORS.btnText, fontWeight: 500, fontSize: "13px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={d.docid} style={{ borderBottom: `1px solid ${COLORS.border}`, backgroundColor: i % 2 === 0 ? "#fff" : COLORS.gray }}>
                  <td style={{ padding: "0.75rem 1rem", color: COLORS.muted }}>{d.docid}</td>
                  <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{d.dname}</td>
                  <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{d.demail}</td>
                  <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{d.dphone || "—"}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <span style={{ backgroundColor: COLORS.btnBg, color: COLORS.btnText, padding: "3px 10px", borderRadius: "20px", fontSize: "12px" }}>
                      {d.specialty || "Sin especialidad"}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => handleEdit(d)} title="Editar" style={iconBtn("#1565C0", "#E3F2FD", "#BBDEFB")}>
                        <Edit style={{ fontSize: "16px" }} />
                      </button>
                      <button onClick={() => handleDelete(d.docid)} title="Eliminar" style={iconBtn("#C62828", "#FFEBEE", "#FFCDD2")}>
                        <Delete style={{ fontSize: "16px" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </div>
  );
}

export default AdminDoctors;