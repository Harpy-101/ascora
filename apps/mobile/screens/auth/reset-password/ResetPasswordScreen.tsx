import { useLocalSearchParams, useRouter } from "expo-router";
import useResetPassword from "./hooks/use-reset-password";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import {
  ResetPasswordFormValues,
  resetPasswordSchema,
} from "./validation/resetPasswordSchema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "../components/FormField";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react-native";

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ token?: string; error?: string }>();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const token = Array.isArray(params.token) ? params.token[0] : params.token;
  const linkError = Array.isArray(params.error)
    ? params.error[0]
    : params.error;

  const resetPassword = useResetPassword();
  const isSubmiting = resetPassword.isPending;

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    await resetPassword.mutateAsync({
      newPassword: values.password,
      token: token,
    });

    router.replace("/login");
  }

  if (linkError || !token) {
    return (
      <View className="flex-1 items-center justify-center gap-4 px-5">
        <Text variant="h2">This link is no longer valid</Text>
        <Text className="text-center text-muted-foreground">
          This link may have expired or already been used
        </Text>

        <Button onPress={() => router.replace("/forgot-password")}>
          <Text>Request another link</Text>
        </Button>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerClassName="grow px-5 py-8 gap-5"
      >
        <View className="w-full max-w-md self-center gap-8">
          <View className="items-center gap-3">
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Text className="text-xl font-bold text-primary">A</Text>
            </View>
          </View>

          <View className="items-center gap-2">
            <Text variant="h1">Create your account</Text>

            <Text className="max-w-xs text-center text-sm leading-5 text-muted-foreground">
              Track your training, review your progress, and keep your workouts
              synced across devices.
            </Text>
          </View>
        </View>

        <View className="gap-5">
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormField label="Password" error={fieldState.error?.message}>
                <Input
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="New password"
                  autoCapitalize="none"
                  secureTextEntry={!showPassword}
                  autoCorrect={false}
                  accessibilityLabel="Password"
                  className="pr-12"
                />

                <Pressable
                  onPress={() => setShowPassword((current) => !current)}
                  className="absolute right-1 top-1 h-10 w-10 items-center justify-center"
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} className="text-muted-foreground" />
                  ) : (
                    <Eye size={19} className="text-muted-foreground" />
                  )}
                </Pressable>
              </FormField>
            )}
          />

          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormField label="Password" error={fieldState.error?.message}>
                <Input
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="New password"
                  autoCapitalize="none"
                  secureTextEntry={!showPassword}
                  autoCorrect={false}
                  accessibilityLabel="Password"
                  className="pr-12"
                />

                <Pressable
                  onPress={() => setShowPassword((current) => !current)}
                  className="absolute right-1 top-1 h-10 w-10 items-center justify-center"
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} className="text-muted-foreground" />
                  ) : (
                    <Eye size={19} className="text-muted-foreground" />
                  )}
                </Pressable>
              </FormField>
            )}
          />

          <Button onPress={form.handleSubmit(onSubmit)}>
            <Text className="font-semibold">
              {isSubmiting ? "Submiting..." : "Reset password"}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
