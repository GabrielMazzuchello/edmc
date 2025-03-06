import React from "react";
import { read, utils } from "xlsx";
import "../styles.css";

const FileUploader = ({ onUploadSuccess }) => {
  const processJSONData = (jsonData) => {
    return Object.entries(jsonData).map(([material, valor], index) => ({
      id: index + 1,
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
        id: index + 1,
        material: row[headers.indexOf("materiais")] || "Sem nome",
        quantidade: Number(row[headers.indexOf("valor")]) || 0,
        restante: Number(row[headers.indexOf("valor")]) || 0,
      }));
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
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
        onUploadSuccess(processedData);
      } catch (error) {
        console.error("Erro no processamento:", error);
      }
    };

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
        Carregar Excel/JSON
      </label>
    </div>
  );
};

export default FileUploader;
