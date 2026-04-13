// import Navigation from "../components/Navigation";
// import { useNavigate } from "react-router-dom";
// import "../styles/Home.css";


// function Home() {
//   const navigate = useNavigate();

//   return (
//     <>
//     <Navigation />
//     <section className="hero">
//       <div className="hero-text">
//         <h1 className="heading-text">Cuidamos tu salud</h1>
//         <span>Donde estés</span>
//         <br />
//       </div>
//       {/* <button className="login-btn-h"  onClick={() => navigate("/login")} >Agenda ya</button> */}
//       <div className="hero-buttons">
//       <button onClick={() => navigate("/login")} className="btn-primary">
//                 Agenda tu cita
//       </button>
//       </div>
//     </section>
//     </>
//   );
// }
// export default Home;

import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navigation />

      <section className="hero">
        <div className="hero-container">

          {/* TEXTO */}
          <div className="hero-left">
            <span className="badge">ATENCIÓN MÉDICA</span>

            <h1>
              Gestiona tu salud <br />
              <span>desde cualquier lugar</span>
            </h1>

            <p>
              Brindamos atención médica profesional
            </p>

            <div className="hero-buttons">
              <button onClick={() => navigate("/login")} className="btn-primary">
                Agenda tu cita
              </button>
            </div>

            <div className="hero-features">
              <span>✔ Innovación en salud para una atención eficiente y segura</span>
            </div>
          </div>

          {/* IMAGEN */}
          <div className="hero-right">
            <img src="/bg01.jpg" alt="Doctor" />
          </div>

        </div>
      </section>
    </>
  );
}

export default Home;