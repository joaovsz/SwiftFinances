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
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", (error as Error).message);
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
          <Pressable onPress={() => router.replace("/Signup")}>
            <Text className="text-green-500 font-alan-bold">
              Cadastre-se
            </Text>
          </Pressable>
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
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <GlassContainer intensity="strong">
            <Text
              className="font-alan-bold text-xl mb-4"
              style={{ color: theme.colors.text }}
            >
              Esqueceu sua senha?
            </Text>
            <Text
              className="font-alan-regular mb-6"
              style={{ color: theme.colors.text }}
            >
              Digite seu email para receber um link de redefinição de senha.
            </Text>
            <CustomTextInput
              label="Email"
              value={resetEmail}
              onChangeText={setResetEmail}
              keyboardType="email-address"
            />
            <View className="flex-row gap-3 mt-6">
              <CustomButton
                title="Cancelar"
                onPress={() => setModalVisible(false)}
                variant="secondary"
                style={{ flex: 1 }}
              />
              <CustomButton
                title="Enviar"
                onPress={async () => {
                  try {
                    await sendPasswordResetEmail(auth, resetEmail);
                    setModalVisible(false);
                    Toast.show({
                      type: "success",
                      text1: "Email enviado com sucesso!",
                    });
                  } catch (error) {
                    Toast.show({
                      type: "error",
                      text1: (error as Error).message,
                    });
                  }
                }}
                style={{ flex: 1 }}
              />
            </View>
          </GlassContainer>
        </View>
      </Modal>
    </SafeAreaView>
  );
}