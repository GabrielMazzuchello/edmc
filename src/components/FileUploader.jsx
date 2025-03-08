import React from "react";
import { read, utils } from "xlsx";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import "../styles/main.css";

const FileUploader = ({ onInventoryCreated }) => {
  // Processa arquivos JSON
  const processJSONData = (jsonData) => {
    return Object.entries(jsonData).map(([material, valor], index) => ({
      id: `${Date.now()}-${index}`,
      material,
      quantidade: Number(valor),
      restante: Number(valor),
    }));
  };

  // Processa arquivos Excel
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

  // Manipula o upload do arquivo
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        let processedData;
        
        // Processa diferentes tipos de arquivo
        if (file.name.endsWith(".xlsx")) {
          const wb = read(e.target.result, { type: "array" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const data = utils.sheet_to_json(ws, { header: 1 });
          processedData = processExcelData(data);
        } else if (file.name.endsWith(".json")) {
          const jsonData = JSON.parse(e.target.result);
          processedData = processJSONData(jsonData);
        } else {
          throw new Error("Formato de arquivo não suportado");
        }

        // Cria o documento no Firestore
        const inventoryRef = await addDoc(collection(db, "inventories"), {
          name: file.name.replace(/\.[^/.]+$/, "") || "Novo Inventário", // Remove extensão do nome
          items: processedData,
          owner: auth.currentUser.uid,
          collaborators: [auth.currentUser.uid],
          createdAt: new Date(),
          updatedAt: new Date()
        });

        onInventoryCreated(inventoryRef.id);
        alert("Inventário criado com sucesso! 🎉");

      } catch (error) {
        console.error("Erro no processamento:", error);
        alert(`Erro: ${error.message}`);
      }
    };

    // Lê o arquivo conforme o formato
    file.name.endsWith(".xlsx") 
      ? reader.readAsArrayBuffer(file)
      : reader.readAsText(file);
  };

  return (
    <div className="upload-section">
      <input
        type="file"
        accept=".xlsx,.json"
        onChange={handleFile}
        id="file-upload"
        hidden
      />
      <label htmlFor="file-upload" className="upload-button">
        📤 Carregar Arquivo (Excel/JSON)
      </label>
    </div>
  );
};

export default FileUploader;