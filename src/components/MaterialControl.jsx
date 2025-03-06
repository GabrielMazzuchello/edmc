function App() {
    const [items, setItems] = useState([]);
    const [error, setError] = useState("");
  
    const handleSubtract = (id, value) => {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id
            ? { ...item, restante: Math.max(0, item.restante - value) }
            : item
        )
      );
    };
    const handleReset = (id) => {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, restante: 0 } : item
        )
      );
    };
  
    const handleRemove = (id) => {
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };
  
    return (
      <div className="App">
        <h1>Controle de Materiais</h1>
  
        <FileUploader
          onUploadSuccess={(data) => {
            setItems(data);
            setError("");
          }}
          onError={(message) => setError(message)}
        />
  
        {error && <div className="error">{error}</div>}
  
        {items.length > 0 && (
          <InventoryTable
            items={items}
            onSubtract={handleSubtract}
            onReset={handleReset}
            onRemove={handleRemove}
          />
        )}
      </div>
    );
  }