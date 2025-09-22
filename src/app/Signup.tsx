import { View, Text, Pressable, SafeAreaView } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { register } from "@/firebase/Services/authService";
import Toast from "react-native-toast-message";
import { CustomTextInput, CustomButton } from "@/src/components/inputs";
import { useTheme } from "@/src/context/ThemeContext";
export default function Signup() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { theme } = useTheme();

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
        backgroundColor: theme.colors.background,
        flex: 1,
        height: "100%",
      }}
    >
      <View className="flex-1 gap-4 relative mx-8 mt-8 justify-center ">
        <Text style={{
          color: theme.colors.text,
          textAlign: 'center',
          marginBottom: 8,
          fontWeight: '600',
          fontSize: 24,
        }}>
          Criar uma nova conta
        </Text>
        <CustomTextInput
          label="Email"
          placeholder="Digite seu email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={{ marginBottom: 12 }}
        />
        <CustomTextInput
          label="Nome Completo"
          placeholder="Digite seu nome completo"
          value={fullName}
          onChangeText={setFullName}
          style={{ marginBottom: 12 }}
        />
        <CustomTextInput
          label="Nome de usuário"
          placeholder="Digite um nome de usuário"
          value={username}
          onChangeText={setUsername}
          style={{ marginBottom: 12 }}
        />
        <CustomTextInput
          label="Informe uma senha"
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{ marginBottom: 12 }}
        />
        <CustomTextInput
          label="Digite novamente"
          placeholder="Senha"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={{ marginBottom: 16 }}
        />

        <CustomButton
          title="Cadastrar"
          onPress={handleSignup}
          size="large"
          style={{ marginTop: 16, marginBottom: 16 }}
        />
        <View className="flex flex-row gap-2 justify-center">
          <Text style={{
            color: theme.colors.text,
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
            Já possui uma conta?
          </Text>
          <Text
            onPress={() => router.replace("/Login")}
            style={{ color: theme.colors.primary }}
            className="font-alan-bold"
          >
            Fazer login
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
