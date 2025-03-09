import { useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import "../styles/main.css";

const SyncManager = ({ inventoryId }) => {
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleAddCollaborator = async () => {
    if (!uid.trim()) return alert("Insira um UID válido!");
    setLoading(true);

    try {
      await updateDoc(doc(db, "inventories", inventoryId), {
        collaborators: arrayUnion(uid.trim()) // Mantém o case original
      });
      alert("Colaborador adicionado!");
      setUid("");
    } catch (error) {
      console.error("Erro ao adicionar:", error);
      alert("Erro: Verifique o UID ou permissões");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sync-manager">
      <h3>🔗 Adicionar Colaborador por UID</h3>
      <div className="share-controls">
        <input
          type="text"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          placeholder="Cole o UID completo (ex: LC5XGIpwWkQ7E5hE9RrEBe3ZO552)"
          disabled={loading}
        />
        <button 
          onClick={handleAddCollaborator}
          disabled={loading}
          className={loading ? "loading" : ""}
        >
          {loading ? "Adicionando..." : "Adicionar"}
        </button>
      </div>
      <p className="info-text">
        💡 O UID deve ser copiado exatamente como está no perfil do usuário
      </p>
    </div>
  );
};

export default SyncManager;