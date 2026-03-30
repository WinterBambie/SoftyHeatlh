import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";


function Home() {
  const navigate = useNavigate();

  return (
    <>
    <Navigation />
    <section className="hero">
      <div className="hero-text">
        <h1 className="heading-text">Hogar ConSalud.</h1>
        <p>Dedicado a proveer la mejor salud y contención.</p>
        <br />
      </div>
      <button className="login-btn-h"  onClick={() => navigate("/login")} >Agenda ya</button>
    </section>
    </>
  );
}
export default Home;