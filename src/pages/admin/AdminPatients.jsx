
const COLORS = {
  primary:   "var(--primarycolor)",
  hover:     "var(--primarycolorhover)",
  btnBg:     "var(--btnice)",
  btnText:   "var(--btnnicetext)",
  border:    "var(--bordercolor)",
  text:      "var(--textcolor)",
  white:     "#ffffff",
  gray:      "#f5f7fa",
  textMuted: "#666",
};


function AdminPatients({ patients }) {
  return (
    <div style={{
      backgroundColor: COLORS.white, borderRadius: "12px",
      padding: "1.5rem", border: `1px solid ${COLORS.border}`,
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
    }}>
      <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", color: COLORS.text }}>
        Pacientes ({patients.length})
      </h3>
      {patients.length === 0 ? (
        <p style={{ color: COLORS.textMuted, fontSize: "14px" }}>No hay pacientes registrados.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ backgroundColor: COLORS.btnBg }}>
              {["#", "Nombre", "Correo", "Teléfono"].map(h => (
                <th key={h} style={{
                  padding: "0.75rem 1rem", textAlign: "left",
                  color: COLORS.btnText, fontWeight: "500", fontSize: "13px"
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {patients.map((p, i) => (
              <tr key={p.pid} style={{
                borderBottom: `1px solid ${COLORS.border}`,
                backgroundColor: i % 2 === 0 ? COLORS.white : COLORS.gray
              }}>
                <td style={{ padding: "0.75rem 1rem", color: COLORS.textMuted }}>{p.pid}</td>
                <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{p.pname}</td>
                <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{p.pemail}</td>
                <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{p.pphone || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPatients;