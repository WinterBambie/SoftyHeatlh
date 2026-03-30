function PatientDashboard() {
  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <h2>Paciente</h2>
        <nav>
          <button>Buscar Doctores</button>
          <button>Mis Reservas</button>
        </nav>
      </aside>
      <main className="content">
        <header>
          <input type="text" placeholder="Buscar doctor o especialidad..." />
          <button className="btn-search">Buscar</button>
        </header>
        <section className="status-box">
          <h2>Tus próximas citas</h2>
          <p>No tienes citas programadas para esta semana.</p>
        </section>
      </main>
    </div>
  );
}
export default PatientDashboard;