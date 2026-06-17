import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Text } from "@/components/ui/text";
import ThemedIcon from "@/components/ui/themed-icon";
import { Ellipsis, Info, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ExerciseAccordionDropdwonMenuProps = {
  exerciseName: string;
  onRemoveExercise: () => void;
};

export default function ExerciseAccordionDropDownMenu({
  exerciseName,
  onRemoveExercise,
}: ExerciseAccordionDropdwonMenuProps) {
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const insets = useSafeAreaInsets();

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 4,
    right: 16,
  };

  function openRemoveDialog() {
    setRemoveDialogOpen(true);
    // requestAnimationFrame(() => {});
  }

  function confirmRemove() {
    setRemoveDialogOpen(false);
    onRemoveExercise();
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger hitSlop={10}>
          <ThemedIcon icon={Ellipsis} size={20} />
        </DropdownMenuTrigger>

        <DropdownMenuContent insets={contentInsets}>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <ThemedIcon icon={Info} size={14} />
              <Text>Exercise details</Text>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive" onPress={openRemoveDialog}>
              <ThemedIcon icon={Trash2} colorToken="destructive" size={14} />
              <Text>Remove</Text>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {exerciseName}</AlertDialogTitle>
            <AlertDialogDescription>
              This wil remove this exercise along with the currently inserted
              setsand remove them permenantly.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction onPress={confirmRemove}>
              <Text>Remove</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
