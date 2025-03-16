import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FileUploader from "../components/FileUploader";
import InventoryTable from "../components/InventoryTable";
import SyncManager from "../components/SyncManager";
import "../styles/main.css";
import ProgressBar from "../components/ProgressBar";

const InventoryPage = () => {
  const { inventoryId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleInventoryCreated = (newInventoryId) => {
    navigate(`/inventory/${newInventoryId}`);
  };

  // Adicione o SyncManager abaixo da tabela
  return (
    <div className="page-container">
      {!inventoryId ? (
        <FileUploader onInventoryCreated={handleInventoryCreated} />
      ) : (
        <>
          <InventoryTable inventoryId={inventoryId} />
          <SyncManager inventoryId={inventoryId} />
        </>
      )}
    </div>
  );
};

export default InventoryPage;
