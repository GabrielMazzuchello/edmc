import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { getAuth } from "firebase/auth";

export const useInventory = (inventoryId) => {
  const auth = getAuth();
  const [inventory, setInventory] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkPermissions = async () => {
    if (!inventoryId || !auth.currentUser) return false;

    const docRef = doc(db, "inventories", inventoryId);
    const docSnap = await getDoc(docRef);

    return (
      docSnap.exists() &&
      (docSnap.data().owner === auth.currentUser.uid ||
        docSnap.data().collaborators?.includes(auth.currentUser.uid))
    );
  };

  const updateItems = async (newItems) => {
    try {
      await updateDoc(doc(db, "inventories", inventoryId), {
        items: newItems,
        updatedAt: new Date(),
      });
    } catch (error) {
      setError("Erro ao atualizar o inventário");
    }
  };

  useEffect(() => {
    if (!inventoryId) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "inventories", inventoryId),
      (doc) => {
        if (doc.exists()) {
          setInventory(doc.data());
          setItems(doc.data().items || []);
          setError(null);
        } else {
          setError("Inventário não encontrado");
        }
        setLoading(false);
      },
      (error) => {
        setError("Erro ao carregar inventário");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [inventoryId]);

  return {
    inventory,
    items,
    error,
    loading,
    updateItems,
    checkPermissions,
  };
};
