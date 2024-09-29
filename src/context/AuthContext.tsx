import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import React from "react";
import Storage from "expo-storage";
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
    Storage.getItem({ key: "auth" }).then((res) => {
      if (res) {
        setUser(JSON.parse(res));
      }
      setLoading(false);
    });
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      user
        ? Storage.setItem({
            key: `auth`,
            value: JSON.stringify(user),
          })
        : Storage.removeItem({ key: "auth" });
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const getLoggedUser = async () => {
      const res = await getUsuarioById();
      res && setUserData(res);
    };
    user && getLoggedUser();
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
