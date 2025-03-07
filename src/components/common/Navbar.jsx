// Navbar.jsx atualizado
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';

const Navbar = () => {
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">EDMC</Link>
        
        <div className="nav-menu">
          {currentUser ? (
            <>
              <Link to="/inventories" className="nav-link">Meus Inventários</Link>
              <button onClick={handleLogout} className="logout-btn">Sair</button>
            </>
          ) : (
            <Link to="/auth" className="nav-link">Entrar</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;