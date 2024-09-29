import { View, Text, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-paper";
import { router } from "expo-router";

import { useState } from "react";
import { Alert } from "react-native";
import { login } from "@/firebase/Services/authService";

import { Modal } from "react-native";
import { Button } from "react-native-paper";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import Toast from "react-native-toast-message";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleForgetPassword = async () => {
    setModalVisible(true);
  };
  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: (error as Error).message,
      });
    }
  };
  const handleSendResetEmail = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      Toast.show({
        type: "success",
        text1: "Email enviado com sucesso",
        text2: "Verifique sua caixa de entrada",
      });
      setModalVisible(false);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: (error as Error).message,
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
        <Pressable onPress={handleForgetPassword}>
          <Text className="text-white text-right font-outfit-bold">
            Esqueci minha senha
          </Text>
        </Pressable>
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
          className="w-full h-full "
        >
          <View className="m-5 bg-white rounded-2xl p-9 top-[30%] shadow-lg">
            <Text className="text-black text-center mb-2 font-outfit-semibold text-2xl">
              Redefinir Senha
            </Text>
            <TextInput
              label={"Email"}
              className="font-outfit-regular"
              placeholder={"Digite seu email"}
              mode={"outlined"}
              textColor="#000"
              style={{ backgroundColor: "#fff", width: "100%" }}
              keyboardType="email-address"
              value={resetEmail}
              onChangeText={setResetEmail}
            />
            <View className="flex-row mt-4 justify-between w-full">
              <Button
                onPress={() => setModalVisible(false)}
                mode="text"
                textColor="rgb(22 163 74)"
              >
                Cancelar
              </Button>
              <Button
                onPress={handleSendResetEmail}
                mode="contained"
                buttonColor="rgb(22 163 74)"
                textColor="white"
              >
                Enviar
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
