import { useNavigate } from "react-router-dom";
import {
  People, LocalHospital, CalendarToday,
  Dashboard, Logout, EventNote
} from "@mui/icons-material";

const COLORS = {
  primary:      "#0A76D8",
  sidebarHover: "#1168D9",
  white:        "#ffffff",
};

const menuItems = [
  { key: "dashboard",    label: "Dashboard", icon: <Dashboard   fontSize="small" /> },
  { key: "patients",     label: "Pacientes", icon: <People      fontSize="small" /> },
  { key: "doctors",      label: "Doctores",  icon: <LocalHospital fontSize="small" /> },
  { key: "appointments", label: "Citas",     icon: <CalendarToday fontSize="small" /> },
  { key: "agenda",       label: "Agenda",    icon: <EventNote   fontSize="small" /> },
];

function Sidebar({ activeMenu, setActiveMenu }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    navigate("/");
  };

  return (
    <div style={{
      width: "230px", backgroundColor: COLORS.primary,
      display: "flex", flexDirection: "column",
      padding: "1.5rem 1rem", position: "sticky",
      top: 0, height: "100vh"
    }}>
      <div style={{ marginBottom: "2rem", paddingLeft: "0.5rem" }}>
        <h2 style={{ color: COLORS.white, fontSize: "1.3rem", margin: 0 }}>HealthApi</h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", margin: "4px 0 0" }}>
          Panel de administración
        </p>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
        {menuItems.map((item) => (
          <button key={item.key} onClick={() => setActiveMenu(item.key)} style={{
            display: "flex", alignItems: "center", gap: "10px",
            background: activeMenu === item.key ? COLORS.sidebarHover : "transparent",
            border: "none", color: COLORS.white,
            textAlign: "left", padding: "0.65rem 1rem",
            borderRadius: "8px", cursor: "pointer", fontSize: "14px",
            transition: "background 0.2s"
          }}>
            {item.icon} {item.label}
          </button>
        ))}
      </nav>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "1rem" }}>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", margin: "0 0 8px", paddingLeft: "0.5rem" }}>
          {user.name}
        </p>
        <button onClick={handleLogout} style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "transparent", border: "1px solid rgba(255,255,255,0.3)",
          color: COLORS.white, padding: "0.5rem 1rem",
          borderRadius: "8px", cursor: "pointer", fontSize: "13px", width: "100%"
        }}>
          <Logout fontSize="small" /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Sidebar;