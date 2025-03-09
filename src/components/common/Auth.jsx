import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import "../../styles/main.css";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (error) {
      setError(error.message.replace("Firebase: ", ""));
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Cadastro"}</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleAuth}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
        />
        <div className="login_buttons">
          <button className="switch-mode" type="submit">{isLogin ? "Entrar" : "Cadastrar"}</button>

          <button onClick={() => setIsLogin(!isLogin)} className="switch-mode">
            {isLogin ? "Criar nova conta" : "Já tenho uma conta"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Auth;
