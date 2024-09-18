import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import HeaderUser from "../components/HeaderUser";
import tw from "twrnc";

export default function Index() {
  return (
    <SafeAreaView style={tw`bg-[#222831] h-full  `}>
      <View
        style={tw`absolute top-[33%] justify-center bg-[#31363F]  w-full h-[100%]`}
      ></View>
      <View style={tw`h-auto w-full py-4 gap-4 px-3`}>
        <HeaderUser />
        <Text style={tw`text-white text-[20px] font-bold text-left pl-6`}>
          Resumo
        </Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tw`flex-row gap-4`}
        >
          <View
            style={tw`p-4 bg-green-400 w-[300px] h-[200px] rounded-2xl `}
          ></View>
          <View
            style={tw`p-4 bg-yellow-400 w-[300px] h-[200px] rounded-2xl mr-4`}
          ></View>
        </ScrollView>

        <Button onPress={() => {}} style={tw`bg-[#3DC2EC] font-[18px]`}>
          Incluir Transação
        </Button>
      </View>
    </SafeAreaView>
  );
}
