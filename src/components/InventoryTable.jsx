import React, { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import "../styles/main.css";
import ProgressBar from "./ProgressBar";

const InventoryTable = ({ inventoryId }) => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  // Cálculo do progresso
  const calculateProgress = () => {
    const total = items.reduce((acc, item) => acc + item.quantidade, 0);
    const remaining = items.reduce((acc, item) => acc + item.restante, 0);

    if (total === 0) return 0; // Evita divisão por zero

    const used = total - remaining;
    return (used / total) * 100;
  };

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

  // Funções de manipulação mantidas iguais
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

  // Cálculo das estatísticas
  const totalItems = items.reduce((acc, item) => acc + item.quantidade, 0);
  const remainingItems = items.reduce((acc, item) => acc + item.restante, 0);
  const usedItems = totalItems - remainingItems;
  const progress = calculateProgress();

  return (
    <div className="inventory-container">
      {error && <div className="error">{error}</div>}

      {/* Barra do Progresso */}
      <div className="progress-section">
        <h3>Progresso do Trabalho</h3>
        <div className="progress-stats">
          <div>
            <span className="stat-number">{usedItems.toLocaleString()}</span>
            <span className="stat-label"> Materiais Usados</span>
          </div>
          <div>
            <span className="stat-number">
              {remainingItems.toLocaleString()}
            </span>
            <span className="stat-label"> Restantes</span>
          </div>
          <div>
            <span className="stat-number">{totalItems.toLocaleString()}</span>
            <span className="stat-label"> Total</span>
          </div>
        </div>
        <ProgressBar percentage={progress} />
      </div>

      {/* Tabela de materiais */}
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
