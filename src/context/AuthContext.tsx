import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Usuario } from "../models/User";
import { getUsuarioById } from "@/firebase/Services/createServices";
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  isAdmin: boolean;
  userData: Usuario | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = await AsyncStorage.getItem("auth");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    initializeAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        AsyncStorage.setItem(
          "auth",
          JSON.stringify({ uid: user.uid, email: user.email })
        );
      } else {
        AsyncStorage.removeItem("auth");
        setUserData(null);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const getLoggedUser = async () => {
      const res = await getUsuarioById();
      if (res) {
        setUserData(res);
      } else {
        setUserData(null);
      }
    };

    if (user) {
      getLoggedUser();
    } else {
      setUserData(null);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin,
        setIsAdmin,
        userData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
