import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import "../../styles/main.css";
import logo from "../../assets/EDTMS-logo.jpeg";

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
          {/* Logo à esquerda */}
          <div className="nav-left">
            <Link to="/" className="logo">
              <img className="navbar_logo-img" src={logo} alt="Logo do EDTMS" />
            </Link>
          </div>

          {/* Link centralizado */}
          <div className="nav-center">
            {currentUser && (
              <Link to="/inventories" className="nav-link">
                📦 Meus Inventários
              </Link>
            )}
          </div>

          {/* User container à direita */}
          <div className="nav-right">
            {currentUser ? (
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
            ) : (
              <Link to="/auth" className="nav-link">
                🔑 Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
