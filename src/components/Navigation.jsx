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
      </ul>
    </nav>
  );
}

export default Navigation;