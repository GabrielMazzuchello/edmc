import React, { useState } from "react";
import { db } from "../firebase/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "../styles/main.css";

const SyncManager = ({ inventoryId }) => {
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInvite = async () => {
    if (!email || !inventoryId) return;

    setIsLoading(true);
    setMessage("");

    try {
      // Em produção, substituir por Cloud Function que busca UID pelo email
      const invitedUserId = email; // Temporário: usar email como ID para testes

      await updateDoc(doc(db, "inventories", inventoryId), {
        collaborators: arrayUnion(invitedUserId),
      });

      setMessage(`Convite enviado para ${email}`);
      setEmail("");
    } catch (error) {
      console.error("Erro ao convidar:", error);
      setMessage("Erro ao enviar convite. Verifique o email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sync-manager">
      <h3>Compartilhar Inventário</h3>

      <div className="invite-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite o email do colaborador"
          disabled={isLoading}
        />

        <button
          onClick={handleInvite}
          disabled={!email || isLoading}
          className="invite-button"
        >
          {isLoading ? "Enviando..." : "Convidar"}
        </button>
      </div>

      {message && (
        <div
          className={`message ${
            message.includes("Erro") ? "error" : "success"
          }`}
        >
          {message}
        </div>
      )}

      <div className="collaborators-list">
        <h4>Colaboradores Atuais</h4>
        {/* Lista seria implementada com dados do Firestore */}
      </div>
    </div>
  );
};

export default SyncManager;
