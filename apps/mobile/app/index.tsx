// import { Text, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { View } from "react-native";

export default function HomeScreen() {
  return (
    // <View className="flex-1 items-center justify-center bg-">
    //   <Text className="text-2xl font-bold text-white">Arsdsa 🚀</Text>
    //   <Button className="">
    //     <Text>Text</Text>
    //   </Button>
    // </View>
    <View className="flex-1 items-center justify-center gap-4 ">
      <Text className="text-2xl font-bold text-foreground">Ascora 🚀</Text>
      <Button>
        <Text>Test Button</Text>
      </Button>
    </View>
  );
}
