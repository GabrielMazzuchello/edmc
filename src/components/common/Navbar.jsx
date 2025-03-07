import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <h1 className="logo">Gestão de Materiais</h1>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/inventory">Estoque</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
