import { doc, DocumentData, setDoc, WithFieldValue } from "firebase/firestore";

import { Usuario } from "../../src/models/User";
import { db } from "@/firebaseConfig";

const addDocumentToCollection = async <T extends WithFieldValue<DocumentData>>(
  collectionName: string,
  id: string,
  data: T
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    console.log(data);
    console.log(id);
    await setDoc(doc(db, collectionName, id), data);
    return {
      success: true,
      message: `${collectionName.slice(0, -1)} adicionado com sucesso`,
    }; // Return success
  } catch (error) {
    return {
      success: false,
      message: `Erro ao adicionar ${collectionName.slice(0, -1)}`,
    };
  }
};

export const addUsuario = async (
  usuario: Usuario
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const result = await addDocumentToCollection<Usuario>(
      "usuarios",
      usuario.id,
      usuario
    );
    console.log(result.message);
    return result;
  } catch (error) {
    console.error("Erro ao adicionar usuario:", error);
    throw new Error("Erro ao adicionar usuario" + error);
  }
};
