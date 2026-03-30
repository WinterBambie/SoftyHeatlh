import { useState, useEffect } from "react";
import usePasswordValidation from "../../Hook/usePasswordValidation";
import {
  getSpecialties,
  getDocumentTypes,
  createDoctor,
} from "../../services/doctorService";

const COLORS = {
  primary: "#0A76D8",
  btnBg: "#D8EBFA",
  btnText: "#1b62b3",
  border: "#e9ecef",
  text: "#212529",
  textMuted: "#666",
  white: "#ffffff",
  gray: "#f5f7fa",
};

const FORM_INITIAL = {
  dname: "",
  demail: "",
  dpassword: "",
  dphone: "",
  ddocument: "",
  tipo_documento_id: "",
  specialty_name: "",
};

function AdminDoctors({ doctors, onDoctorCreated }) {
 

  // En el handleSubmit

  const [showForm, setShowForm] = useState(false);
  const [docTypes, setDocTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState(FORM_INITIAL);

  useEffect(() => {
    const fetchSelects = async () => {
      const [docRes] = await Promise.all([getDocumentTypes()]);
      setDocTypes(docRes);
    };
    fetchSelects();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
      if (!isValid) {
        setError("La contraseña no cumple los requisitos.");
        return;
      }
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));

      const res = await createDoctor(formData);

      if (res.status === "success") {
        setSuccess("Doctor registrado correctamente.");
        setForm(FORM_INITIAL);
        setShowForm(false);
        onDoctorCreated();
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.6rem 0.75rem",
    border: `1px solid ${COLORS.border}`,
    borderRadius: "8px",
    fontSize: "14px",
    color: COLORS.text,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: "13px",
    color: COLORS.textMuted,
    marginBottom: "4px",
    display: "block",
  };

  return (
    <div
      style={{
        backgroundColor: COLORS.white,
        borderRadius: "12px",
        padding: "1.5rem",
        border: `1px solid ${COLORS.border}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "1rem", color: COLORS.text }}>
          Doctores ({doctors.length})
        </h3>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setError("");
            setSuccess("");
          }}
          style={{
            backgroundColor: COLORS.primary,
            color: COLORS.white,
            border: "none",
            borderRadius: "8px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          {showForm ? "Cancelar" : "+ Registrar doctor"}
        </button>
      </div>

      {/* Mensajes */}
      {error && (
        <p style={{ color: "#C62828", fontSize: "13px", marginBottom: "1rem" }}>
          {error}
        </p>
      )}
      {success && (
        <p style={{ color: "#2E7D32", fontSize: "13px", marginBottom: "1rem" }}>
          {success}
        </p>
      )}

      {/* Formulario */}
      {showForm && (
        <div
          style={{
            backgroundColor: COLORS.gray,
            borderRadius: "10px",
            padding: "1.25rem",
            marginBottom: "1.5rem",
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <h4
            style={{ margin: "0 0 1rem", fontSize: "14px", color: COLORS.text }}
          >
            Nuevo doctor
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <label style={labelStyle}>Nombre completo *</label>
              <input
                name="dname"
                value={form.dname}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Ej: Dr. Juan Pérez"
              />
            </div>
            <div>
              <label style={labelStyle}>Correo electrónico *</label>
              <input
                name="demail"
                type="email"
                value={form.demail}
                onChange={handleChange}
                style={inputStyle}
                placeholder="doctor@email.com"
              />
            </div>
            <div>
              <label style={labelStyle}>Contraseña *</label>
              <input
                name="dpassword"
                type="password"
                value={form.dpassword}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Contraseña"
              />
            </div>
            <div>
              <label style={labelStyle}>Teléfono</label>
              <input
                name="dphone"
                value={form.dphone}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Ej: 3001234567"
              />
            </div>
            <div>
              <label style={labelStyle}>Tipo de documento *</label>
              <select
                name="tipo_documento_id"
                value={form.tipo_documento_id}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Seleccionar...</option>
                {docTypes.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Número de documento *</label>
              <input
                name="ddocument"
                value={form.ddocument}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Ej: 12345678"
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Especialidad *</label>
              <input
                name="specialty_name"
                value={form.specialty_name}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Ej: Cardiología"
              />
            </div>
          </div>

          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                backgroundColor: COLORS.primary,
                color: COLORS.white,
                border: "none",
                borderRadius: "8px",
                padding: "0.6rem 1.5rem",
                cursor: "pointer",
                fontSize: "14px",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Guardando..." : "Registrar doctor"}
            </button>
          </div>
        </div>
      )}

      {/* Tabla */}
      {doctors.length === 0 ? (
        <p style={{ color: COLORS.textMuted, fontSize: "14px" }}>
          No hay doctores registrados.
        </p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: COLORS.btnBg }}>
              {["#", "Nombre", "Correo", "Teléfono", "Especialidad"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: "0.75rem 1rem",
                      textAlign: "left",
                      color: COLORS.btnText,
                      fontWeight: "500",
                      fontSize: "13px",
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {doctors.map((d, i) => (
              <tr
                key={d.docid}
                style={{
                  borderBottom: `1px solid ${COLORS.border}`,
                  backgroundColor: i % 2 === 0 ? COLORS.white : COLORS.gray,
                }}
              >
                <td
                  style={{ padding: "0.75rem 1rem", color: COLORS.textMuted }}
                >
                  {d.docid}
                </td>
                <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>
                  {d.dname}
                </td>
                <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>
                  {d.demail}
                </td>
                <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>
                  {d.dphone || "—"}
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <span
                    style={{
                      backgroundColor: COLORS.btnBg,
                      color: COLORS.btnText,
                      padding: "3px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                    }}
                  >
                    {d.specialty || "Sin especialidad"}
                  </span>
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
