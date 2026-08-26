import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Text } from "@/components/ui/text";
import ThemedIcon from "@/components/ui/themed-icon";
import { LucideIcon } from "lucide-react-native";
import { useState } from "react";

type DletionWarningPoOverProps = {
  targetName: string;
  description: string;
  triggerIcon: LucideIcon;
  triggerIconSize?: number;
  onRemove: () => void;
};

export default function DeletionWarningPopOver({
  targetName,
  description,
  triggerIcon,
  triggerIconSize = 18,
  onRemove,
}: DletionWarningPoOverProps) {
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  function confirmRemove() {
    setRemoveDialogOpen(false);
    onRemove();
  }
  return (
    <>
      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogTrigger>
          <ThemedIcon
            icon={triggerIcon}
            colorToken="destructive"
            size={triggerIconSize}
          />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {targetName}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
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
