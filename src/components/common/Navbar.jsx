import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import "../../styles/main.css";

const Navbar = () => {
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-menu">
          {currentUser ? (
            <>
              <Link to="/" className="logo">
                EDTM
              </Link>
              <Link to="/inventories" className="nav-link">
                📦 Meus Inventários
              </Link>
              <div className="user-container">
                <div className="user-info">
                  <span>
                    Seu UID: <code>{currentUser.uid}</code>
                  </span>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                  🚪 Sair
                </button>
              </div>
            </>
          ) : (
            <Link to="/auth" className="nav-link">
              🔑 Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
