import styles from "./Navigation.module.css";
function Navigation() {
  return (
    <nav className={styles.navigation}>
      <ul className={styles.list}>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  );
}
export default Navigation;