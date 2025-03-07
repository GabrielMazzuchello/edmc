// InventoriesPage.jsx
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { Link } from 'react-router-dom';

const InventoriesPage = () => {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventories = async () => {
      try {
        const q = query(
          collection(db, 'inventories'),
          where('collaborators', 'array-contains', auth.currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const inventoriesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setInventories(inventoriesData);
      } catch (error) {
        console.error('Erro ao carregar inventários:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventories();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="inventories-page">
      <h1>Meus Inventários</h1>
      <div className="inventories-list">
        {inventories.map(inventory => (
          <Link 
            key={inventory.id} 
            to={`/inventory/${inventory.id}`}
            className="inventory-card"
          >
            <h3>{inventory.name || 'Inventário Sem Nome'}</h3>
            <p>Criado em: {new Date(inventory.createdAt?.toDate()).toLocaleDateString()}</p>
          </Link>
        ))}
      </div>
      <Link to="/inventory/new" className="create-btn">Novo Inventário</Link>
    </div>
  );
};

export default InventoriesPage;