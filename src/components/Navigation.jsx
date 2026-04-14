import styles from "./Navigation.module.css";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png"; 
function Navigation() {
  return (
    <nav className={styles.navigation}>

      {/* Logo */}
      <div className={styles.logoContainer}>
      <img src={logo} alt="Logo" className={styles.logo} />
      </div>
      <ul className={styles.list}>
        <li>
          <NavLink 
            to="/" 
            end
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Inicio
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/about"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Nosotros
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/contact"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Contactos
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;