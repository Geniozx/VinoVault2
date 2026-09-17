import { useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../context/authContext";

function Footer() {
  const { isAuthenticated } = useContext(AuthContext);

  const currentYear = new Date().getFullYear();

  return (
  <footer className="site-footer">
    <div className="footer-inner">
      <div className="footer-brand">
        <h2>VinoVault</h2>
        <p>Collect · Explore · Remember</p>
      </div>

      <nav
        className="footer-navigation"
        aria-label="Footer navigation"
      >
        <Link to="/">Home</Link>
        <Link to="/browse">Browse Wines</Link>

        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/cellar">My Cellar</Link>
            <Link to="/tasting-notes">Tasting Notes</Link>
          </>
        ) : (
          <>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Create Account</Link>
          </>
        )}
      </nav>

      <p className="footer-copyright">
        &copy; {currentYear} VinoVault
      </p>
    </div>
  </footer>
);
}

export default Footer;