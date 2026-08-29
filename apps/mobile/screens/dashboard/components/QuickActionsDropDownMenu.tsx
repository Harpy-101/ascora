import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemedIcon from "@/components/ui/themed-icon";
import { CirclePlus } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/button";

export default function QuickActionsDropDownMenu() {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <ThemedIcon icon={CirclePlus} colorToken="primary" size={24} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onPress={() => router.push("/weight/new")}>
          <Text>Add weight</Text>
        </DropdownMenuItem>
        <DropdownMenuItem onPress={() => router.push("/workouts/plans/new")}>
          <Text>Add workout plan</Text>
        </DropdownMenuItem>
        <DropdownMenuItem onPress={() => router.push("/goals/new")}>
          <Text>Add goal</Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
