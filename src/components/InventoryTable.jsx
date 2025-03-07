import React from "react";
import "../styles/main.css";



const InventoryTable = ({ items, onSubtract, onReset, onRemove }) => {
  const handleKeyDown = (e, item) => {
    if (e.key === "Enter") {
      const value = parseInt(e.target.value);
      if (!isNaN(value) && value > 0) {
        onSubtract(item.id, value);
        e.target.value = "";
      }
    }
  };

  return (
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
                onKeyDown={(e) => handleKeyDown(e, item)}
              />
            </td>
            <td className="actions">
              <button onClick={() => onReset(item.id)} className="reset-btn">
                Zerar
              </button>
              <button onClick={() => onRemove(item.id)} className="remove-btn">
                Remover
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InventoryTable;
