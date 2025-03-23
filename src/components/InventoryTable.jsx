import React, { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import ProgressBar from "./ProgressBar";
import "../styles/main.css";

const InventoryTable = ({ inventoryId }) => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [newItem, setNewItem] = useState({ material: "", quantidade: "" });

  // Firebase operations
  useEffect(() => {
    if (!inventoryId) return;

    const unsubscribe = onSnapshot(
      doc(db, "inventories", inventoryId),
      (doc) => doc.exists() && setItems(doc.data().items || []),
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

  // Handlers
  const handleAddItem = async () => {
    if (!newItem.material.trim() || !newItem.quantidade) {
      alert("Preencha todos os campos!");
      return;
    }
  
    try {
      const normalizedMaterial = newItem.material.trim().toLowerCase();
      const newQuantity = Number(newItem.quantidade);
      
      // Verifica se o material já existe
      const existingItemIndex = items.findIndex(item => 
        item.material.trim().toLowerCase() === normalizedMaterial
      );
  
      let updatedItems;
  
      if (existingItemIndex !== -1) {
        // Atualiza o item existente
        updatedItems = items.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantidade: item.quantidade + newQuantity,
              restante: item.restante + newQuantity
            };
          }
          return item;
        });
      } else {
        // Cria novo item
        const newItemData = {
          id: Date.now().toString(),
          material: newItem.material.trim(),
          quantidade: newQuantity,
          restante: newQuantity
        };
        updatedItems = [...items, newItemData];
      }
  
      await updateDoc(doc(db, "inventories", inventoryId), {
        items: updatedItems,
        updatedAt: new Date()
      });
  
      setNewItem({ material: "", quantidade: "" });
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      alert("Erro ao adicionar item");
    }
  };

  const handleSubtract = async (id, value) => {
    const newItems = items.map((item) => 
      item.id === id ? { 
        ...item, 
        restante: Math.max(0, item.restante - value) 
      } : item
    );
    await updateInventory(newItems);
  };

  const handleReset = async (id) => {
    const newItems = items.map((item) => 
      item.id === id ? { ...item, restante: 0 } : item
    );
    await updateInventory(newItems);
  };

  const handleRemove = async (id) => {
    const newItems = items.filter((item) => item.id !== id);
    await updateInventory(newItems);
  };

  // Progress calculations
  const totalItems = items.reduce((acc, item) => acc + item.quantidade, 0);
  const remainingItems = items.reduce((acc, item) => acc + item.restante, 0);
  const usedItems = totalItems - remainingItems;
  const progress = totalItems > 0 ? (usedItems / totalItems) * 100 : 0;

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

      {/* Materials Table */}
      <div className="table-container">
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
                <td>
                  <div className="action-buttons">
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
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

          {/* Add Item Section */}
          <tfoot>
            <tr>
              <td colSpan="5">
                <div className="add-item-container">
                  <div className="add-item-row">
                    <input
                      type="text"
                      placeholder="Novo material"
                      value={newItem.material}
                      onChange={(e) => setNewItem({...newItem, material: e.target.value})}
                    />
                    <input
                      type="number"
                      placeholder="Qtd."
                      min="1"
                      value={newItem.quantidade}
                      onChange={(e) => setNewItem({...newItem, quantidade: e.target.value})}
                    />
                    <button 
                      onClick={handleAddItem}
                      className="add-item-button"
                    >
                      ➕ Adicionar
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;