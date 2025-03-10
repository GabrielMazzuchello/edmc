// HomePage.jsx
import { Link } from "react-router-dom";
import listaJogoImg from "../assets/images-readme/lista_jogo.png";
import blocoNotasImg from "../assets/images-readme/blocoNotas.png";

const HomePage = () => {
  return (
    <div className="home-container">
      <h1>Bem-vindo ao EDTM - Sistema de Gerenciamento de Inventários</h1>
      <h4>Feito por GabrielDesuBR</h4>
      <br />

      <div className="beta-alert">
        <h3>⚠️ Aviso Importante: Versão Beta</h3>
        <p>
          Recarregar a página fora da Home pode causar erro 404. Terá que voltar
          ao <Link to="/">início</Link> para continuar.
        </p>
        <br />
        <br />
      </div>

      <div className="guide-section">
        <h2>📝 Como Criar Seus Arquivos para Importar</h2>

        <div className="step">
          <div className="step-content">
            <div>
              <h3>1. Capture sua Lista</h3>
              <p>Tire um print da tela do jogo com os itens visíveis</p>
              <img src={listaJogoImg} alt="Exemplo de lista do jogo" />
            </div>
          </div>
        </div>

        <div className="step">
          <div className="step-content">
            <div>
              <h3>2. Converta para JSON</h3>

              <p>
                Use ferramentas como:
                <br />
                <a
                  href="https://www.deepseek.com"
                  target="_blank"
                  rel="noopener"
                >
                  DeepSeek
                </a>{" "}
                ou
                <a href="https://chatgpt.com" target="_blank" rel="noopener">
                  ChatGPT
                </a>
                <br />
                Com as imagens do jogo use o prompt:
                <br />
                <code>
                  <b>
                    Converta esta lista de materiais para JSON com as chaves
                    sendo os itens
                  </b>
                </code>
                <p>
                  Logo apos a IA gerar o json voce irá abrir o bloco de notas e
                  colar o que a IA gerar e salvar
                </p>
                <p>
                  <b>
                    Lembre-se que o nome do arquivo será o nome da tabela no
                    site EX:
                  </b>
                </p>
              </p>
              <img src={blocoNotasImg} alt="Exemplo bloco de notas" />
            </div>
          </div>
        </div>
      </div>

      <div className="quick-start">
        <h2>⚡ Comece Agora</h2>
        <Link to="/inventory/new" className="cta-button">
          Criar Novo Inventário
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
