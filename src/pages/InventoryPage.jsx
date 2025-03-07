import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInventory } from "../hooks/useInventory";
import FileUploader from "../components/common/FileUploader";
import InventoryTable from "../components/InventoryTable";
import SyncManager from "../components/SyncManager";
import "../styles/main.css";

const InventoryPage = () => {
  const { inventoryId } = useParams();
  const navigate = useNavigate();
  const { inventory, items, error, loading, updateItems, checkPermissions } =
    useInventory(inventoryId);

  // Verifica permissões ao carregar a página
  useEffect(() => {
    const verifyAccess = async () => {
      if (inventoryId && !loading) {
        const hasAccess = await checkPermissions();
        if (!hasAccess) navigate("/");
      }
    };
    verifyAccess();
  }, [inventoryId, loading]);

  const handleUploadSuccess = (newInventoryId) => {
    navigate(`/inventory/${newInventoryId}`);
  };

  const handleUpdateItems = async (updatedItems) => {
    try {
      await updateItems(updatedItems);
    } catch (error) {
      console.error("Erro na atualização:", error);
    }
  };

  if (loading) return <div className="loading">Carregando inventário...</div>;

  return (
    <div className="page-container">
      <h1>{inventory?.name || "Novo Inventário"}</h1>

      {!inventoryId ? (
        <FileUploader onUploadSuccess={handleUploadSuccess} />
      ) : (
        <>
          <div className="inventory-actions">
            <SyncManager inventoryId={inventoryId} />
          </div>

          <InventoryTable items={items} onUpdate={handleUpdateItems} />
        </>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default InventoryPage;
