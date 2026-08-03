import { Button } from "@/components/ui/button";
import { AutoSaveStatus } from "../hooks/use-auto-save";
import { Text } from "@/components/ui/text";

export default function AutosaveIndicator({
  status,
  lastSavedAt,
  onRetry,
}: {
  status: AutoSaveStatus;
  lastSavedAt: Date | null;
  onRetry: () => void;
}) {
  if (status === "saving") {
    return <Text className="text-xs text-muted-foreground">Saving...</Text>;
  }

  if (status === "unsaved") {
    return (
      <Text className="text-xs text-muted-foreground">Unsaved changes</Text>
    );
  }

  if (status === "error") {
    return (
      <Button size="sm" variant="ghost" onPress={onRetry}>
        <Text className="text-destructive">Save failed · Retry</Text>
      </Button>
    );
  }

  if (status === "saved" && lastSavedAt) {
    return <Text className="text-xs text-muted-foreground">Saved</Text>;
  }

  return null;
}
