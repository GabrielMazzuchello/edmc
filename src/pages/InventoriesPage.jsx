import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { Link } from 'react-router-dom';
import '../styles/main.css';

const InventoriesPage = () => {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Função para carregar inventários
  const fetchInventories = async () => {
    try {
      const q = query(
        collection(db, 'inventories'),
        where('collaborators', 'array-contains', auth.currentUser.uid),
        orderBy('updatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const inventoriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));
      
      setInventories(inventoriesData);
    } catch (error) {
      setError('Erro ao carregar inventários');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Função para excluir inventário
  const handleDelete = async (inventoryId, ownerId) => {
    try {
      // Verifica se o usuário atual é o dono
      if (auth.currentUser.uid !== ownerId) {
        alert('Apenas o dono pode excluir este inventário!');
        return;
      }

      if (!window.confirm('Tem certeza que deseja excluir permanentemente este inventário?')) return;

      await deleteDoc(doc(db, 'inventories', inventoryId));
      setInventories(prev => prev.filter(item => item.id !== inventoryId));
      alert('Inventário excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir inventário');
    }
  };

  useEffect(() => {
    if (auth.currentUser) fetchInventories();
  }, []);

  if (loading) return <div className="loading">⏳ Carregando...</div>;
  if (error) return <div className="error">❌ {error}</div>;

  return (
    <div className="inventories-page">
      <h1>📚 Meus Inventários</h1>
      <div className="inventories-grid">
        {inventories.map(inventory => (
          <div key={inventory.id} className="inventory-card">
            <div className="card-header">
              <h3>{inventory.name || 'Inventário Sem Nome'}</h3>
              {auth.currentUser?.uid === inventory.owner && (
                <button 
                  onClick={() => handleDelete(inventory.id, inventory.owner)}
                  className="delete-btn"
                  title="Excluir inventário"
                >
                  🗑️
                </button>
              )}
            </div>
            <Link to={`/inventory/${inventory.id}`} className="inventory-link">
              <div className="meta-info">
                <span>🕒 Criado em: {inventory.createdAt?.toLocaleDateString()}</span>
                <span>✏️ Última atualização: {inventory.updatedAt?.toLocaleDateString()}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <Link to="/inventory/new" className="create-btn">➕ Novo Inventário</Link>
    </div>
  );
};

export default InventoriesPage;