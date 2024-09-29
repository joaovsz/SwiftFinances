import { View, Text, Pressable, SafeAreaView } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import { router } from "expo-router";
import { register } from "@/firebase/Services/authService";
import Toast from "react-native-toast-message";
export default function Signup() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Toast.show({
        type: "warning",
        text1: "Senhas não conferem",
      });
      return;
    }

    try {
      await register(email, password, {
        name: fullName,
        user: username,
        email,
      });
      Toast.show({
        type: "success",
        text1: "Conta criada com sucesso",
      });
      router.replace("/Login");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Erro ao criar conta",
        text2: error.message,
      });
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
          Criar uma nova conta
        </Text>
        <TextInput
          label={"Email"}
          placeholder={"Digite seu email"}
          mode={"outlined"}
          className="font-outfit-regular"
          textColor="#fff"
          style={{ backgroundColor: "#1E1E1E" }}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          label={"Nome Completo"}
          placeholder={"Digite seu nome completo"}
          mode={"outlined"}
          className="font-outfit-regular"
          textColor="#fff"
          style={{ backgroundColor: "#1E1E1E" }}
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          label={"Nome de usuário"}
          placeholder={"Digite um nome de usuário"}
          mode={"outlined"}
          className="font-outfit-regular"
          textColor="#fff"
          style={{ backgroundColor: "#1E1E1E" }}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          label={"Informe uma senha"}
          placeholder={"Senha"}
          className="font-outfit-regular"
          mode={"outlined"}
          textColor="#fff"
          style={{ backgroundColor: "#1E1E1E" }}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          label={"Digite novamente"}
          placeholder={"Senha"}
          className="font-outfit-regular"
          mode={"outlined"}
          textColor="#fff"
          style={{ backgroundColor: "#1E1E1E" }}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Pressable
          className="bg-green-500 p-4 mt-4 rounded-2xl"
          onPress={handleSignup}
        >
          <Text className="text-white text-center font-outfit-bold text-xl">
            Cadastrar
          </Text>
        </Pressable>
        <View className="flex flex-row gap-2 justify-center">
          <Text className="text-white  text-center font-outfit-bold">
            Já possui uma conta?
          </Text>
          <Text
            onPress={() => router.replace("/Login")}
            className="text-green-500 font-outfit-bold"
          >
            Fazer login
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
