import React, { useEffect } from "react";
import { useInventory } from "../hooks/useInventory.js";
import { getAuth } from "../../services/auth";
import "../styles/main.css";

const InventoryTable = ({ inventoryId }) => {
  const auth = getAuth();
  const { items, updateItems } = useInventory(inventoryId);
  const [localItems, setLocalItems] = React.useState(items);
  const [error, setError] = React.useState(null);

  // Sincroniza o estado local com as atualizações do Firestore
  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const handleSubtract = async (id, value) => {
    try {
      const newItems = localItems.map((item) =>
        item.id === id
          ? {
              ...item,
              restante: Math.max(0, item.restante - value),
              lastModified: new Date().toISOString(),
              modifiedBy: auth.currentUser?.uid || "anonymous",
            }
          : item
      );

      await updateItems(newItems);
    } catch (error) {
      setError("Erro ao atualizar o item");
      console.error("Erro na subtração:", error);
    }
  };

  const handleReset = async (id) => {
    try {
      const newItems = localItems.map((item) =>
        item.id === id
          ? {
              ...item,
              restante: 0,
              lastModified: new Date().toISOString(),
              modifiedBy: auth.currentUser?.uid || "anonymous",
            }
          : item
      );

      await updateItems(newItems);
    } catch (error) {
      setError("Erro ao resetar o item");
      console.error("Erro no reset:", error);
    }
  };

  const handleRemove = async (id) => {
    try {
      const newItems = localItems.filter((item) => item.id !== id);
      await updateItems(newItems);
    } catch (error) {
      setError("Erro ao remover o item");
      console.error("Erro na remoção:", error);
    }
  };

  const handleKeyDown = (e, item) => {
    if (e.key === "Enter") {
      const value = parseInt(e.target.value);
      if (!isNaN(value) && value > 0) {
        handleSubtract(item.id, value);
        e.target.value = "";
      }
    }
  };

  if (!localItems)
    return <div className="loading">Carregando inventário...</div>;

  return (
    <div className="inventory-container">
      {error && <div className="error-banner">{error}</div>}

      <table className="materials-table">
        <thead>
          <tr>
            <th>Material</th>
            <th>Total</th>
            <th>Atual</th>
            <th>Subtrair</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {localItems.map((item) => (
            <tr key={item.id}>
              <td>{item.material}</td>
              <td>{item.quantidade}</td>
              <td className={item.restante <= 0 ? "stock-empty" : ""}>
                {item.restante}
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  max={item.restante}
                  onKeyDown={(e) => handleKeyDown(e, item)}
                  aria-label={`Subtrair quantidade de ${item.material}`}
                />
              </td>
              <td className="actions">
                <button
                  onClick={() => handleReset(item.id)}
                  className="reset-btn"
                  disabled={item.restante === 0}
                >
                  Zerar
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="remove-btn"
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
