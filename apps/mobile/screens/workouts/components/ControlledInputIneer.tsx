import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useRef, useState } from "react";
import { Keyboard, View } from "react-native";
import { Text } from "@/components/ui/text";

type ControlledInputInnerProps = {
  field: any;
  fieldState: any;
};

export default function ControlledInputInner({
  field,
  fieldState,
}: ControlledInputInnerProps) {
  const [focused, setFocused] = useState(false);
  const triggerRef = useRef<any>(null);
  const errorMessage = fieldState.error?.message;
  const shouldShowErrorCard = Boolean(errorMessage && focused);

  useEffect(() => {
    let timeOutId: ReturnType<typeof setTimeout> | undefined;
    if (shouldShowErrorCard) {
      triggerRef.current?.close?.();
      timeOutId = setTimeout(() => {
        triggerRef.current?.open?.();
      }, 400);
    } else {
      triggerRef.current?.close?.();
    }

    return () => {
      if (timeOutId) clearTimeout(timeOutId);
    };
  }, [shouldShowErrorCard]);

  return (
    <View className="flex-1">
      <Popover>
        <PopoverTrigger ref={triggerRef} asChild>
          <Input
            {...field}
            value={String(field.value ?? "")}
            onChangeText={field.onChange}
            onBlur={() => {
              field.onBlur();
              setFocused(false);
            }}
            onFocus={() => setFocused(true)}
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
            aria-invalid={fieldState.invalid}
            autoComplete={false}
            className={
              fieldState.invalid
                ? "text-center border-destructive"
                : "text-center"
            }
          />
        </PopoverTrigger>
        {errorMessage ? (
          <PopoverContent
            side="top"
            sideOffset={10}
            className="w-40 border-destructive bg-popover"
          >
            <Text className="mt-1 text-xs text-destructive">
              {fieldState?.error?.message}
            </Text>
          </PopoverContent>
        ) : null}
      </Popover>
    </View>
  );
}
