import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dashboard, CalendarToday, History, Person, Schedule, Menu, Close, Logout } from "@mui/icons-material";
import { DOCTOR_COLORS } from "./../../pages/doctor/doctorStyles";

const menuItems = [
  { key: "home",    label: "Dashboard",    icon: <Dashboard fontSize="small" /> },
  { key: "today",   label: "Citas de hoy", icon: <CalendarToday fontSize="small" /> },
  { key: "agenda",  label: "Agenda",       icon: <Schedule fontSize="small" /> },
  { key: "history", label: "Historial",    icon: <History fontSize="small" /> },
  { key: "profile", label: "Mi perfil",    icon: <Person fontSize="small" /> },
];

function DoctorSidebar({ activeMenu, setActiveMenu, user }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const content = (
    <div style={{
      width: "220px", backgroundColor: DOCTOR_COLORS.sidebar,
      color: DOCTOR_COLORS.white, display: "flex",
      flexDirection: "column", height: "100vh", padding: "1.5rem 1rem",
    }}>
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.2rem", color: DOCTOR_COLORS.white }}>SoftyHealth</h2>
          <p style={{ margin: "4px 0 0", fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>Portal médico</p>
        </div>
        <button onClick={() => setIsOpen(false)} className="close-btn" style={{
          background: "none", border: "none", color: DOCTOR_COLORS.white,
          cursor: "pointer", padding: 0, display: "none",
        }}>
          <Close fontSize="small" />
        </button>
      </div>

      {/* Avatar del doctor */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "10px",
        padding: "0.75rem", marginBottom: "1.5rem",
      }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "50%",
          backgroundColor: DOCTOR_COLORS.primary,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px", fontWeight: 600, color: "#fff", flexShrink: 0,
        }}>
          {user?.name?.charAt(0)?.toUpperCase() ?? "D"}
        </div>
        <div style={{ overflow: "hidden" }}>
          <p style={{ margin: 0, fontSize: "13px", fontWeight: 500, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user?.name ?? "Doctor"}
          </p>
          <p style={{ margin: 0, fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>Médico</p>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
        {menuItems.map(item => (
          <button key={item.key} onClick={() => { setActiveMenu(item.key); setIsOpen(false); }} style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "0.65rem 1rem", borderRadius: "8px", border: "none",
            cursor: "pointer", fontSize: "13px", textAlign: "left",
            color: activeMenu === item.key ? "#fff" : "rgba(255,255,255,0.7)",
            backgroundColor: activeMenu === item.key ? DOCTOR_COLORS.primary : "transparent",
            transition: "all 0.2s",
          }}>
            {item.icon} {item.label}
          </button>
        ))}
      </nav>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "1rem" }}>
        <button onClick={handleLogout} style={{
          display: "flex", alignItems: "center", gap: "8px",
          width: "100%", padding: "0.5rem 1rem", borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.2)",
          backgroundColor: "transparent", color: "rgba(255,255,255,0.8)",
          cursor: "pointer", fontSize: "13px",
        }}>
          <Logout fontSize="small" /> Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="sidebar-desktop" style={{ position: "fixed", top: 0, left: 0, zIndex: 100 }}>{content}</div>
      <button className="hamburger-btn" onClick={() => setIsOpen(true)} style={{
        position: "fixed", top: 12, left: 12, zIndex: 200,
        backgroundColor: DOCTOR_COLORS.sidebar, border: "none",
        borderRadius: "6px", padding: "8px", color: "#fff",
        cursor: "pointer", display: "none",
      }}><Menu /></button>
      {isOpen && <div onClick={() => setIsOpen(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 150 }} />}
      <div className="sidebar-mobile" style={{
        position: "fixed", top: 0, left: 0, zIndex: 160,
        transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease",
      }}>{content}</div>
      <style>{`
        @media (min-width: 768px) {
          .sidebar-desktop { display: block !important; }
          .sidebar-mobile  { display: none !important; }
          .hamburger-btn   { display: none !important; }
        }
        @media (max-width: 767px) {
          .sidebar-desktop { display: none !important; }
          .sidebar-mobile  { display: block !important; }
          .hamburger-btn   { display: flex !important; }
          .close-btn       { display: flex !important; }
        }
      `}</style>
    </>
  );
}

export default DoctorSidebar;