import React, { useState } from "react";
import { read, utils } from "xlsx";
import { db } from "../../services/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "../styles/main.css";

const FileUploader = ({ onUploadSuccess }) => {
  const auth = getAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Processa dados JSON para formato padrão
  const processJSONData = (jsonData) => {
    return Object.entries(jsonData).map(([material, valor], index) => ({
      id: `${Date.now()}-${index}`, // ID único
      material,
      quantidade: Number(valor),
      restante: Number(valor),
      lastModified: new Date(),
    }));
  };

  // Processa dados do Excel para formato padrão
  const processExcelData = (data) => {
    const headers = data[0].map((h) => h.trim().toLowerCase());
    return data
      .slice(1)
      .filter((row) => row.length >= 2)
      .map((row, index) => ({
        id: `${Date.now()}-${index}`, // ID único
        material: row[headers.indexOf("materiais")] || "Sem nome",
        quantidade: Number(row[headers.indexOf("valor")]) || 0,
        restante: Number(row[headers.indexOf("valor")]) || 0,
        lastModified: new Date(),
      }));
  };

  // Valida o arquivo antes do processamento
  const validateFile = (file) => {
    if (!file) throw new Error("Nenhum arquivo selecionado");
    if (!file.name.match(/\.(xlsx|json)$/)) {
      throw new Error("Formato de arquivo não suportado");
    }
  };

  // Manipula o upload do arquivo
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file || !auth.currentUser) return;

    setIsLoading(true);
    const reader = new FileReader();

    try {
      validateFile(file);

      reader.onload = async (e) => {
        try {
          let processedData;

          // Processamento específico por tipo de arquivo
          if (file.name.endsWith(".xlsx")) {
            const wb = read(e.target.result, { type: "array" });
            const ws = wb.Sheets[wb.SheetNames[0]];
            const data = utils.sheet_to_json(ws, { header: 1 });
            processedData = processExcelData(data);
          } else {
            const jsonData = JSON.parse(e.target.result);
            processedData = processJSONData(jsonData);
          }

          // Criação do inventário no Firestore
          const inventoryRef = await addDoc(collection(db, "inventories"), {
            name: file.name.replace(/\.[^/.]+$/, ""),
            owner: auth.currentUser.uid,
            collaborators: [auth.currentUser.uid],
            items: processedData,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          // Atualiza o usuário com o novo inventário
          await updateDoc(doc(db, "users", auth.currentUser.uid), {
            inventories: arrayUnion(inventoryRef.id),
          });

          onUploadSuccess(inventoryRef.id);
        } catch (error) {
          console.error("Erro no processamento:", error);
          alert(`Erro: ${error.message}`);
        } finally {
          setIsLoading(false);
        }
      };

      // Inicia a leitura do arquivo
      file.name.endsWith(".xlsx")
        ? reader.readAsArrayBuffer(file)
        : reader.readAsText(file);
    } catch (error) {
      console.error("Erro na validação:", error);
      alert(`Erro: ${error.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-section">
      <input
        type="file"
        accept=".xlsx,.json"
        onChange={handleFile}
        id="file-upload"
        hidden
        disabled={isLoading}
      />

      <label
        htmlFor="file-upload"
        className={`upload-button ${isLoading ? "loading" : ""}`}
      >
        {isLoading ? (
          <span>Processando...</span>
        ) : (
          <span>Carregar Excel/JSON</span>
        )}
      </label>

      {isLoading && (
        <div className="upload-progress">
          <div className="progress-bar" />
        </div>
      )}
    </div>
  );
};

export default FileUploader;
