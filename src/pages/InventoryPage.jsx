import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FileUploader from "../components/FileUploader";
import InventoryTable from "../components/InventoryTable";
import SyncManager from "../components/SyncManager";
import "../styles/main.css";

const InventoryPage = () => {
  const { inventoryId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleInventoryCreated = (newInventoryId) => {
    navigate(`/inventory/${newInventoryId}`);
  };

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

      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default InventoryPage;
