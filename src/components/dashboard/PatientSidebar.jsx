import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarToday, History, Person, Home, Logout, Menu } from "@mui/icons-material";

const COLORS = {
  primary: "#0A76D8",
  white: "#ffffff",
  hover: "#1168D9",
};

const menuItems = [
  { key: "home", label: "Inicio", icon: <Home fontSize="small" /> },
  { key: "booking", label: "Agendar", icon: <CalendarToday fontSize="small" /> },
  { key: "history", label: "Mis citas", icon: <History fontSize="small" /> },
  { key: "profile", label: "Perfil", icon: <Person fontSize="small" /> },
];

function PatientSidebar({ activeMenu, setActiveMenu, user }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      {/* HAMBURGER */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          backgroundColor: COLORS.primary,
          border: "none",
          borderRadius: "6px",
          padding: "8px",
          color: COLORS.white,
          zIndex: 200,
          cursor: "pointer",
          display: "none",
        }}
        className="hamburger-btn"
      >
        <Menu />
      </button>

      {/* SIDEBAR */}
      <div
        className="sidebar"
        style={{
          width: "230px",
          backgroundColor: COLORS.primary,
          display: "flex",
          flexDirection: "column",
          padding: "1.5rem 1rem",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          transition: "transform 0.3s ease",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          zIndex: 100,
        }}
      >
        {/* LOGO */}
        <div style={{ marginBottom: "2rem", paddingLeft: "0.5rem" }}>
          <h2 style={{ color: COLORS.white, fontSize: "1.3rem", margin: 0 }}>
            HealthApi
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "12px",
              margin: "4px 0 0",
            }}
          >
            Panel paciente
          </p>
        </div>

        {/* MENU */}
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            flex: 1,
          }}
        >
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveMenu(item.key);
                setIsOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background:
                  activeMenu === item.key ? COLORS.hover : "transparent",
                border: "none",
                color: COLORS.white,
                textAlign: "left",
                padding: "0.65rem 1rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                transition: "background 0.2s",
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        {/* USER */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.2)",
            paddingTop: "1rem",
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "12px",
              margin: "0 0 8px",
              paddingLeft: "0.5rem",
            }}
          >
            {user?.name || "Paciente"}
          </p>

          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.3)",
              color: COLORS.white,
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
              width: "100%",
            }}
          >
            <Logout fontSize="small" /> Cerrar sesión
          </button>
        </div>
      </div>

      {/* RESPONSIVE */}
      <style>
        {`
          @media (min-width: 768px) {
            .sidebar { transform: translateX(0) !important; }
            .hamburger-btn { display: none !important; }
          }

          @media (max-width: 767px) {
            .hamburger-btn { display: block !important; }
          }
        `}
      </style>
    </>
  );
}

export default PatientSidebar;