import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { Usuario } from "../../src/models/User";
import { addUsuario } from "./createServices";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";

export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { uid } = userCredential.user;
    const usuarioData = await getUsuarioData(uid);
    return usuarioData;
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      throw new Error("Usuário não encontrado.");
    } else if (error.code === "auth/invalid-credential") {
      throw new Error("Senha incorreta.");
    } else if (error.code === "auth/too-many-requests") {
      throw new Error(
        "Muitas tentativas de login. Tente novamente mais tarde."
      );
    } else {
      throw new Error("Erro ao fazer login. Tente novamente.");
    }
  }
};
export const getUsuarioData = async (uid: string): Promise<Usuario | null> => {
  const usuarioDocRef = doc(db, "usuarios", uid);
  try {
    const usuarioDoc = await getDoc(usuarioDocRef);

    if (usuarioDoc.exists()) {
      return usuarioDoc.data() as Usuario;
    } else {
      console.log("Documento de usuário não encontrado.");
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar os dados do usuário:", error);
    throw new Error("Erro ao buscar os dados do usuário.");
  }
};
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const register = async (
  email: string,
  password: string,
  usuarioData: Omit<Usuario, "id" | "createdAt">
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { uid } = userCredential.user;
    const usuario: Usuario = {
      ...usuarioData,
      id: uid,
      createdAt: new Date(),
    };
    const result = await addUsuario(usuario);

    if (!result.success) {
      throw new Error(result.message);
    }
  } catch (error: any) {
    if (error.code === "auth/email-already-in-use") {
      throw new Error("Este email já está em uso. Por favor, use outro email.");
    } else {
      throw new Error(error.message);
    }
  }
};
