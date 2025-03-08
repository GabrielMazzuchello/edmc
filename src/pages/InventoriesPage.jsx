import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { Link } from 'react-router-dom';
import '../styles/main.css';

const InventoriesPage = () => {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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

    fetchInventories();
  }, []);

  if (loading) return <div className="loading">⏳ Carregando...</div>;
  if (error) return <div className="error">❌ {error}</div>;

  return (
    <div className="inventories-page">
      <h1>📚 Meus Inventários</h1>
      <div className="inventories-grid">
        {inventories.map(inventory => (
          <Link 
            key={inventory.id} 
            to={`/inventory/${inventory.id}`}
            className="inventory-card"
          >
            <h3>{inventory.name || 'Inventário Sem Nome'}</h3>
            <div className="meta-info">
              <span>🕒 Criado em: {inventory.createdAt?.toLocaleDateString()}</span>
              <span>✏️ Última atualização: {inventory.updatedAt?.toLocaleDateString()}</span>
            </div>
          </Link>
        ))}
      </div>
      <Link to="/inventory/new" className="create-btn">➕ Novo Inventário</Link>
    </div>
  );
};

export default InventoriesPage;