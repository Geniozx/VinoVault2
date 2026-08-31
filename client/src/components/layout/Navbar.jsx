import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/useAuth";


function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        navigate("/", { replace: true });
        await logout();
    }

    return (
        <header>
        <nav>
            <Link to="/">VinoVault</Link>

            <Link to="/browse">Browse Wines</Link>

            {isAuthenticated ? (
            <>
                <Link to="/cellar">My Cellar</Link>
                <button type="button" onClick={handleLogout}>
                Logout
                </button>
            </>
            ) : (
            <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </>
            )}
        </nav>
        </header>
    );
}

export default Navbar;