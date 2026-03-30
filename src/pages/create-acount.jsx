import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import "../styles/login.css";
import "../styles/signup.css";

function CreateAccount() {
  const navigate = useNavigate();
  
  // 1. Los hooks siempre al principio y una sola vez
  const [account, setAccount] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setAccount({
      ...account,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de contraseñas
    if (account.password !== account.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // 2. Recuperamos los datos personales guardados en el paso anterior (Signup.jsx)
    const personalData = JSON.parse(sessionStorage.getItem("temp_personal_data"));

    if (!personalData) {
      alert("Faltan datos personales. Por favor, regresa al paso anterior.");
      navigate("/signup");
      return;
    }

    try {
      // 3. Llamamos al servicio para enviar todo al backend (api.php)
      const response = await register(personalData, account);

      if (response.status === "success") {
        alert("¡Registro exitoso!");
        sessionStorage.clear(); // Limpiamos los datos temporales
        navigate("/login");
      } else {
        alert("Error: " + response.message);
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("No se pudo conectar con el servidor. Verifica que Apache y MySQL estén activos.");
    }
  };

  return (
    <div className="full-screen-center">
      <div className="container">
        <div className="signup-card">
          <h1 className="header-text">Crear Cuenta</h1>
          <p className="sub-text">Añade tus datos de acceso</p>

          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                name="email"
                placeholder="ejemplo@email.com"
                className="input-text"
                value={account.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                name="password"
                placeholder="Ingresa tu contraseña"
                className="input-text"
                value={account.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirma tu contraseña"
                className="input-text"
                value={account.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="button-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                className="login-btn btn-primary-soft btn"
                onClick={() => navigate("/signup")}
                style={{ flex: 1 }}
              >
                Atrás
              </button>

              <button
                type="submit"
                className="login-btn btn-primary btn"
                style={{ flex: 1 }}
              >
                Crear cuenta
              </button>
            </div>
          </form>

          <p className="sub-text" style={{ marginTop: '20px' }}>
            ¿Ya tienes una cuenta?
            <a href="/login" className="hover-link1 non-style-link"> Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;