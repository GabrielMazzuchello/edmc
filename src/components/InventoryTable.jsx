import React, { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import "../styles/main.css";

const InventoryTable = ({ inventoryId }) => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!inventoryId) return;

    const unsubscribe = onSnapshot(
      doc(db, "inventories", inventoryId),
      (doc) => {
        if (doc.exists()) {
          setItems(doc.data().items || []);
        }
      },
      (error) => {
        setError("Erro ao carregar inventário");
        console.error("Erro:", error);
      }
    );

    return () => unsubscribe();
  }, [inventoryId]);

  const updateInventory = async (newItems) => {
    try {
      await updateDoc(doc(db, "inventories", inventoryId), {
        items: newItems,
        updatedAt: new Date(),
      });
    } catch (error) {
      setError("Erro ao atualizar inventário");
      console.error("Erro:", error);
    }
  };

  const handleSubtract = (id, value) => {
    const newItems = items.map((item) =>
      item.id === id
        ? {
            ...item,
            restante: Math.max(0, item.restante - value),
          }
        : item
    );
    updateInventory(newItems);
  };

  const handleReset = (id) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, restante: 0 } : item
    );
    updateInventory(newItems);
  };

  const handleRemove = (id) => {
    const newItems = items.filter((item) => item.id !== id);
    updateInventory(newItems);
  };

  return (
    <div className="inventory-container">
      {error && <div className="error">{error}</div>}

      <table className="materials-table">
        <thead>
          <tr>
            <th>Material</th>
            <th>Total</th>
            <th>Atual</th>
            <th>Entrega</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.material}</td>
              <td>{item.quantidade}</td>
              <td>{item.restante}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  max={item.restante}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0) {
                        handleSubtract(item.id, value);
                        e.target.value = "";
                      }
                    }
                  }}
                />
              </td>
              <td className="actions">
                <button
                  onClick={() => handleReset(item.id)}
                  className="reset-btn"
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
