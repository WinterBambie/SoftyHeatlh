import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { getDocumentTypes } from "../services/authService"; 
import "../styles/login.css";
import "../styles/signup.css";

function Signup() {
  const navigate = useNavigate(); 
  
  const [docTypes, setDocTypes] = useState([]);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    address: "",
    nic: "",
    dob: "",
    tipo_documento_id: "", 
  });

  useEffect(() => {
    // Ahora la función ya está disponible para cargar los datos de la DB
    getDocumentTypes()
      .then(data => {
        setDocTypes(data);
      })
      .catch(error => console.error("Error cargando tipos de documento:", error));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = () => {
    setFormData({
      fname: "",
      lname: "",
      address: "",
      nic: "",
      dob: "",
      tipo_documento_id: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Guardamos los datos personales en el navegador temporalmente
    sessionStorage.setItem("temp_personal_data", JSON.stringify(formData));
    // Pasamos al paso 2: Crear correo y contraseña
    navigate("/create-account");
  };

  return (
    <div className="full-screen-center">
      <div className="container">
        <div className="signup-card">
          <h1 className="header-text">Sign up</h1>
          <p className="sub-text">Añade tus datos personales para continuar</p>

          <form onSubmit={handleSubmit} onReset={handleReset} className="form">
            <div className="form-group">
              <label>Tipo de Documento</label>
              <select 
                name="tipo_documento_id"
                value={formData.tipo_documento_id} 
                onChange={handleChange}
                className="input-text"
                required
              >
                <option value="">Seleccione...</option>
                {docTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="nic">Número de Identificación</label>
              <input
                type="text"
                name="nic"
                placeholder="Número de identificación"
                className="input-text"
                value={formData.nic}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="fname">Nombre</label>
                <input
                  type="text"
                  name="fname"
                  placeholder="Nombres"
                  className="input-text"
                  value={formData.fname}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="lname">Apellido</label>
                <input
                  type="text"
                  name="lname"
                  placeholder="Apellidos"
                  className="input-text"
                  value={formData.lname}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Dirección</label>
              <input
                type="text"
                name="address"
                placeholder="Ej: Calle 1 #20..."
                className="input-text"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dob">Fecha de nacimiento</label>
              <input
                type="date"
                name="dob"
                className="input-text"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>

            <div className="button-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="reset" className="login-btn btn-primary-soft btn" style={{ flex: 1 }}>
                Restablecer
              </button>
              <button type="submit" className="login-btn btn-primary btn" style={{ flex: 1 }}>
                Siguiente
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

export default Signup;