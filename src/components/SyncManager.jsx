import { useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../services/firebase";

const SyncManager = ({ inventoryId }) => {
  const [uid, setUid] = useState("");

  const handleShare = async () => {
    try {
      await updateDoc(doc(db, "inventories", inventoryId), {
        collaborators: arrayUnion(uid.trim()) // Adiciona o UID digitado
      });
      alert("Colaborador adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
      alert("Erro: Verifique o UID ou permissões");
    }
  };

  return (
    <div className="sync-manager">
      <input
        type="text"
        value={uid}
        onChange={(e) => setUid(e.target.value)}
        placeholder="Cole o UID do colaborador (ex: RqUqIjrFzKOEAC0KzAvF67jGd2G3)"
      />
      <button onClick={handleShare}>Adicionar Colaborador</button>
    </div>
  );
};

export default SyncManager;