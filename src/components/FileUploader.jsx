import React, { useState } from "react";
import { read, utils } from "xlsx";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import "../styles/main.css";

const FileUploader = ({ onInventoryCreated }) => {
  const [showNameModal, setShowNameModal] = useState(false);
  const [inventoryName, setInventoryName] = useState("");
  const [fileToProcess, setFileToProcess] = useState(null);
  const [creationType, setCreationType] = useState(null);

  const handleProcessFile = async (file) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        let processedData;
        
        if (file.name.endsWith(".xlsx")) {
          const wb = read(e.target.result, { type: "array" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const data = utils.sheet_to_json(ws, { header: 1 });
          processedData = processExcelData(data);
        } else if (file.name.endsWith(".json")) {
          const jsonData = JSON.parse(e.target.result);
          processedData = processJSONData(jsonData);
        }

        await handleCreateInventory(processedData);
      } catch (error) {
        console.error("Erro no processamento:", error);
        alert(`Erro: ${error.message}`);
      }
    };

    file.name.endsWith(".xlsx") 
      ? reader.readAsArrayBuffer(file)
      : reader.readAsText(file);
  };

  const processJSONData = (jsonData) => {
    return Object.entries(jsonData).map(([material, valor], index) => ({
      id: `${Date.now()}-${index}`,
      material,
      quantidade: Number(valor),
      restante: Number(valor),
    }));
  };

  const processExcelData = (data) => {
    const headers = data[0].map((h) => h.trim().toLowerCase());
    return data
      .slice(1)
      .filter((row) => row.length >= 2)
      .map((row, index) => ({
        id: `${Date.now()}-${index}`,
        material: row[headers.indexOf("materiais")] || "Sem nome",
        quantidade: Number(row[headers.indexOf("valor")]) || 0,
        restante: Number(row[headers.indexOf("valor")]) || 0,
      }));
  };

  const handleCreateInventory = async (items) => {
    try {
      const inventoryRef = await addDoc(collection(db, "inventories"), {
        name: inventoryName || (creationType === 'file' 
          ? fileToProcess.name.replace(/\.[^/.]+$/, "") 
          : "Novo Inventário"),
        items,
        owner: auth.currentUser.uid,
        collaborators: [auth.currentUser.uid],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      onInventoryCreated(inventoryRef.id);
      setShowNameModal(false);
      setInventoryName("");
      setFileToProcess(null);
    } catch (error) {
      console.error("Erro ao criar inventário:", error);
      alert("Erro ao criar inventário");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileToProcess(file);
    setCreationType("file");
    setShowNameModal(true);
  };

  const handleEmptyInventory = () => {
    setCreationType("empty");
    setShowNameModal(true);
  };

  return (
    <div className="upload-section">
      {/* Modal de Nomeação */}
      {showNameModal && (
        <div className="modal-overlay">
          <div className="name-modal">
            <h3>📝 Nome do Inventário</h3>
            <input
              type="text"
              placeholder="Ex: Materiais da Base Alpha"
              value={inventoryName}
              onChange={(e) => setInventoryName(e.target.value)}
              autoFocus
            />
            <div className="modal-actions">
              <button
                onClick={() => {
                  if (creationType === 'file') {
                    handleProcessFile(fileToProcess);
                  } else {
                    handleCreateInventory([]);
                  }
                }}
                className="confirm-btn"
              >
                {creationType === 'file' ? 'Criar' : 'Criar Vazio'}
              </button>
              <button
                onClick={() => {
                  setShowNameModal(false);
                  setInventoryName("");
                }}
                className="cancel-btn"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botões Principais */}
      <button onClick={handleEmptyInventory} className="upload-button">
        📭 Criar Inventário Vazio
      </button>

      <input
        type="file"
        accept=".xlsx,.json"
        onChange={handleFileChange}
        id="file-upload"
        hidden
      />
      <label htmlFor="file-upload" className="upload-button">
        📤 Carregar Arquivo
      </label>
    </div>
  );
};

export default FileUploader;