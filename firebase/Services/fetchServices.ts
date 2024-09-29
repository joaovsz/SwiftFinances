import { collection, doc, getDocs } from "firebase/firestore";

import { db } from "../../firebaseConfig";

const fetchCollection = async <T>(collectionName: string): Promise<T[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(
      (doc) =>
        ({
          ...doc.data(),
          id: doc.id,
        } as T)
    );
  } catch (e) {
    console.error(`Erro ao buscar documentos de ${collectionName}: `, e);
    return [];
  }
};

