import { useState } from "react";
import "../styles/Login.css";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    setError("Debe ingresar correo y contraseña");
    return;
  }

  setError("");
  setLoading(true);

  try {
    // USA LA FUNCIÓN QUE IMPORTASTE DE AUTHSERVICE
    const data = await login(email, password); 

    if (data.status === "success") {
const role = data.user.role;
      // Redirección dinámica según el tipo de usuario
if (role === "admin")        navigate("/admin/AdminDashboard");
else if (role === "patient") navigate("/patient/PatientDashboard");
else if (role === "doctor")  navigate("/doctor/DoctorDashboard");
    } else {
      setError(data.message || "Error en las credenciales");
    }
  } catch (err) {
    console.error("Error detallado:", err);
    setError("Error al conectar con el servidor. Verifica CORS y XAMPP.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="full-screen-center">
      <div className="login-container">
        <div className="login-card">
          <h1 className="header-text">Bienvenido</h1>
          <p className="sub-text">Inicie sesión con sus datos para continuar</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Correo</label>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="error-text" style={{color: 'red', textAlign: 'center'}}>{error}</p>}

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Cargando..." : "Login"}
            </button>
          </form>

          <p className="sub-text">¿Has olvidado tu correo electrónico?</p>
          <p className="sub-text">
            ¿No tienes una cuenta?{" "}
            <Link className="hover-link1" to="/signup">
              Regístrese
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;