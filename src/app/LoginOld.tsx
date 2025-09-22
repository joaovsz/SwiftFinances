import { View, Text, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { useState } from "react";
import { Alert } from "react-native";
import { login } from "@/firebase/Services/authService";

import { Modal } from "react-native";
import { Button } from "react-native-paper";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import Toast from "react-native-toast-message";
import { CustomTextInput, CustomButton } from "@/src/components/inputs";
import { useTheme } from "@/src/context/ThemeContext";
import { GlassContainer } from "@/src/components/GlassContainer";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const { theme } = useTheme();

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
        backgroundColor: theme.colors.background,
        flex: 1,
        height: "100%",
      }}
    >
      <View className="flex-1 gap-6 relative mx-6 mt-8 justify-center">
        <GlassContainer intensity="medium" style={{ marginBottom: 20 }}>
          <Text 
            className="font-alan-bold text-3xl text-center mb-6"
            style={{ color: theme.colors.text }}
          >
            Swift Finances
          </Text>
          <Text 
            className="font-alan-medium text-lg text-center mb-8"
            style={{ color: theme.colors.text }}
          >
            Faça login em sua conta
          </Text>
          
          <CustomTextInput
            label="Email"
            placeholder="Digite seu email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            fontWeight="400"
          />
          
          <CustomTextInput
            label="Senha"
            placeholder="Senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            fontWeight="400"
          />
          
          <Pressable onPress={handleForgetPassword}>
            <Text 
              className="font-alan-semibold text-right"
              style={{ color: theme.colors.primary }}
            >
              Esqueci minha senha
            </Text>
          </Pressable>
          
          <CustomButton
            title="Entrar"
            onPress={handleLogin}
            size="large"
            style={{ marginTop: 16 }}
          />
        </GlassContainer>
        
        <View className="flex flex-row gap-2 justify-center mt-6">
          <Text 
            className="font-alan-medium text-center"
            style={{ color: theme.colors.text }}
          >
            Ainda não tem uma conta?
          </Text>
          <Text
            onPress={() => router.replace("/Signup")}
            className="text-green-500 font-alan-bold"
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
            backgroundColor: "rgba(0,0,0,0.8)",
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <GlassContainer intensity="strong" style={{ width: '100%', maxWidth: 400 }}>
            <Text 
              className="font-alan-bold text-2xl text-center mb-6"
              style={{ color: theme.colors.text }}
            >
              Redefinir Senha
            </Text>
            <CustomTextInput
              label="Email"
              placeholder="Digite seu email"
              keyboardType="email-address"
              value={resetEmail}
              onChangeText={setResetEmail}
              fontWeight="400"
            />
            <View className="flex-row mt-6 justify-between w-full">
              <CustomButton
                title="Cancelar"
                onPress={() => setModalVisible(false)}
                variant="outline"
                size="medium"
                style={{ flex: 1, marginRight: 8 }}
              />
              <CustomButton
                title="Enviar"
                onPress={handleSendResetEmail}
                variant="primary"
                size="medium"
                style={{ flex: 1, marginLeft: 8 }}
              />
            </View>
          </GlassContainer>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
