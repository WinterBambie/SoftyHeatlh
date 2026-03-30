function DoctorDashboard() {
  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <h2>Doctor Panel</h2>
        <nav>
          <button className="active">Mis Citas</button>
          <button>Mis Sesiones</button>
          <button>Configuración</button>
        </nav>
      </aside>
      <main className="content">
        <h1>Bienvenido, Dr. {JSON.parse(localStorage.getItem("user")).name}</h1>
        <div className="stats">
          <div className="card"><h3>Citas Hoy</h3><p>5</p></div>
          <div className="card"><h3>Pacientes Totales</h3><p>40</p></div>
        </div>
      </main>
    </div>
  );
}
export default DoctorDashboard;