import { Slot, Stack } from "expo-router";

export default function Home() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => null,
        }}
      />
    </Stack>
  );
}
