import { NativeMuscleBody } from "@/components/muscle-map/muscleMapRendered";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { useState } from "react";
import { ExtendedBodyPart } from "react-muscle-highlighter";
import { View } from "react-native";

type MuscleMapVaiewerProps = {
  defaultSide?: string;
  muscleMapData: ExtendedBodyPart[];
};

export default function MuscleMapViewer({
  defaultSide = "front",
  muscleMapData,
}: MuscleMapVaiewerProps) {
  const [side, setSide] = useState(defaultSide);

  return (
    <Tabs value={side} onValueChange={setSide}>
      <TabsList>
        <TabsTrigger value="front">
          <Text>Front</Text>
        </TabsTrigger>
        <TabsTrigger value="back">
          <Text>Back</Text>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="front">
        <View className="w-full h-57.5 items-center justify-center rounded-xl bg-muted/40">
          <NativeMuscleBody data={muscleMapData} side="front" />
        </View>
      </TabsContent>
      <TabsContent value="back">
        <View className="w-full h-57.5 items-center justify-center rounded-xl bg-muted/40">
          <NativeMuscleBody data={muscleMapData} side="back" />
        </View>
      </TabsContent>
    </Tabs>
  );
}
