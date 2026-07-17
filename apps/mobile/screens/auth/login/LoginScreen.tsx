import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LoginFormValues, loginSchema } from "./validation/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Text } from "@/components/ui/text";
import FormField from "../components/FormField";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import useUserLogin from "./hooks/use-user-login";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const login = useUserLogin();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginFormValues) {
    console.log("Login form values", values);
    login.mutateAsync(values);
  }

  const isSubmiting = "";

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerClassName="grow px-5 py-8"
      >
        <View className="w-full max-w-md self-center gap-8">
          <View className="items-center gap-3">
            <View className="h-14 w-14 items-center justify-center  rounded-2xl bg-primary/10">
              <Text className="text-xl font-bold text-primary">A</Text>
            </View>
          </View>

          <View className="items-center gap-2">
            <Text variant="h1">Login into your account</Text>
          </View>
        </View>

        <View className="gap-5">
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormField label="Email" error={fieldState.error?.message}>
                <Input
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  returnKeyType="next"
                  accessibilityLabel="Email address"
                />
              </FormField>
            )}
          />

          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormField label="Password" error={fieldState.error?.message}>
                <View className="relative">
                  <Input
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Your super secure password"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="current-password"
                    returnKeyType="done"
                    onSubmitEditing={form.handleSubmit(onSubmit)}
                    accessibilityLabel="Password"
                    className="pr-12"
                  />

                  <Pressable
                    onPress={() => setShowPassword((current) => !current)}
                    className="absolute right-1 h-10 w-10 items-center justify-center"
                    accessibilityRole="button"
                    accessibilityLabel={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} className="text-primary-foreground" />
                    ) : (
                      <Eye size={19} className="text-primary-foreground" />
                    )}
                  </Pressable>
                </View>
              </FormField>
            )}
          />

          {form.formState.errors.root?.server ? (
            <View className="rounded-xl border border-destructive/30 bg-destructive/10 p-3">
              <Text
                accessibilityRole="alert"
                className="text-sm text-destructive"
              >
                {form.formState.errors.root.server.message}
              </Text>
            </View>
          ) : null}
        </View>

        <Button onPress={form.handleSubmit(onSubmit)} className="mt-8">
          <Text className="font-semibold">
            {isSubmiting ? "Logging in..." : "Login"}
          </Text>
        </Button>

        <View className="items-center gap-4 mt-4">
          <View className="flex-row items-center gap-1">
            <Text className="text-sm text-muted-foreground">
              Don&apos;t have an account?
            </Text>

            <Pressable onPress={() => router.replace("/signup")}>
              <Text className="text-sm font-semibold text-primary">
                Sign up
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
