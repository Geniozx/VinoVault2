import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/useAuth";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  async function handleLogout() {
    await logout();
    closeMenu();
    navigate("/", { replace: true });
  }

  return (
    <>
      <header className="desktop-header">
        <nav
          className="desktop-navbar"
          aria-label="Main navigation"
        >
          <Link
            className="desktop-navbar-brand"
            to="/"
          >
            <img
              className="desktop-navbar-logo"
              src="/VinoVault logo only.png"
              alt="VinoVault"
            />

            <span className="desktop-navbar-brand-text">
              <strong>VinoVault</strong>
              <small>Collect · Explore · Remember</small>
            </span>
          </Link>

          <div className="desktop-navbar-links">
            {isAuthenticated && (
              <Link to="/dashboard">
                Dashboard
              </Link>
            )}

            <Link to="/browse">
              Browse Wines
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/cellar">
                  My Cellar
                </Link>

                <Link to="/tasting-notes">
                  Tasting Notes
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  Sign In
                </Link>

                <Link to="/register">
                  Create Account
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <div className="mobile-navbar">
        <div className="mobile-navbar-bar">
          <Link
            className="mobile-navbar-brand"
            to="/"
            onClick={closeMenu}
          >
            <img
              src="/VinoVault logo only.png"
              alt="VinoVault"
            />
          </Link>

          <button
            className="mobile-navbar-trigger"
            type="button"
            aria-label={
              isMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <nav
          id="mobile-navigation"
          className={
            isMenuOpen
              ? "mobile-navbar-menu mobile-navbar-menu-open"
              : "mobile-navbar-menu"
          }
          aria-label="Mobile navigation"
        >
          {isAuthenticated && (
            <Link
              to="/dashboard"
              onClick={closeMenu}
            >
              Dashboard
            </Link>
          )}

          <Link
            to="/browse"
            onClick={closeMenu}
          >
            Browse Wines
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/cellar"
                onClick={closeMenu}
              >
                My Cellar
              </Link>

              <Link
                to="/tasting-notes"
                onClick={closeMenu}
              >
                Tasting Notes
              </Link>

              <button
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
              >
                Sign In
              </Link>

              <Link
                to="/register"
                onClick={closeMenu}
              >
                Create Account
              </Link>
            </>
          )}
        </nav>
      </div>
    </>
  );
}

export default Navbar;