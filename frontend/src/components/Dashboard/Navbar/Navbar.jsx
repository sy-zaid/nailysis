import { getRole } from "../../../utils/utils";
import styles from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";

const Navbar = ({ setView }) => {
  const navigate = useNavigate();
  const userRole = getRole();
  const handleScanNailsClick = () => {
    navigate("/upload-image");
  };

  return (
    <nav className={styles.container}>
      <span className={styles.searchBar}>
        <input type="search" placeholder="Search..." />
        <i className="fa-solid fa-magnifying-glass"></i>
      </span>
      <div className={styles.navSide}>
        <button onClick={() => setView("Nails Scan")}>
          {/* <img src="nail.png" alt="nail icon" /> */}
          <h5>Scan Nails</h5>
        </button>
        <div>
          <img src="icon-bell-black.png" alt="notification button" />
        </div>
        <p className={styles.loggedInRole}>Logged In As: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}</p>
      </div>
    </nav>
  );
};

export default Navbar;
