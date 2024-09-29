import { View, Text, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-paper";
import { router } from "expo-router";

import { useState } from "react";
import { Alert } from "react-native";
import { login } from "@/firebase/Services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#1E1E1E",
        flex: 1,
        height: "100%",
      }}
    >
      <View className="flex-1 gap-4 relative mx-8 mt-8 justify-center ">
        <Text className="text-white text-center mb-2 font-outfit-semibold text-2xl ">
          Faça login em sua conta
        </Text>
        <TextInput
          label={"Email"}
          className="font-outfit-regular"
          placeholder={"Digite seu email"}
          mode={"outlined"}
          textColor="#fff"
          style={{ backgroundColor: "#1E1E1E" }}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          label={"Senha"}
          placeholder={"Senha"}
          mode={"outlined"}
          textColor="#fff"
          className="font-outfit-regular"
          style={{ backgroundColor: "#1E1E1E" }}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Text className="text-white text-right font-outfit-bold">
          Esqueceu sua senha?
        </Text>
        <Pressable
          className="bg-green-500 p-4 rounded-2xl"
          onPress={handleLogin}
        >
          <Text className="text-white text-center font-outfit-bold text-xl">
            Entrar
          </Text>
        </Pressable>
        <View className="flex flex-row gap-2 justify-center">
          <Text className="text-white  text-center font-outfit-bold">
            Ainda não tem uma conta?
          </Text>
          <Text
            onPress={() => router.replace("/Signup")}
            className="text-green-500 font-outfit-bold"
          >
            Cadastre-se
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
