import { Controller, useForm } from "react-hook-form";
import { SignupFormValues, signupSchema } from "./validation/singupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import useCreateUser from "./hooks/use-create-user";
import FormField from "../components/FormField";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function SignupScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const createnewUser = useCreateUser();
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const isSubmiting = createnewUser.isPending;

  function onSubmit(values: SignupFormValues) {
    console.log("Submitted form values", values);
    createnewUser.mutateAsync(values);
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
            control={form.control}
            name="firstName"
            render={({ field, fieldState }) => (
              <FormField label="First name" error={fieldState.error?.message}>
                <Input
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="First name"
                  autoCapitalize="words"
                  autoComplete="given-name"
                  returnKeyType="next"
                  accessibilityLabel="First name"
                />
              </FormField>
            )}
          />

          <Controller
            control={form.control}
            name="lastName"
            render={({ field, fieldState }) => (
              <FormField label="Last name" error={fieldState.error?.message}>
                <Input
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Last name"
                  autoCapitalize="words"
                  autoComplete="family-name"
                  returnKeyType="next"
                  accessibilityLabel="Last name"
                />
              </FormField>
            )}
          />

          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormField
                label="Email address"
                error={fieldState.error?.message}
              >
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
              <FormField
                label="Password"
                description="Use at least 8 characters."
                error={fieldState.error?.message}
              >
                <View className="relative">
                  <Input
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Create a password"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="new-password"
                    returnKeyType="done"
                    onSubmitEditing={form.handleSubmit(onSubmit)}
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

        <Button onPress={form.handleSubmit(onSubmit)}>
          <Text className="font-semibold">
            {isSubmiting ? "Creating account..." : "Create account"}
          </Text>
        </Button>

        <View className="items-center gap-4">
          <View className="flex-row items-center gap-1">
            <Text className="text-sm text-muted-foreground">
              Already have an account?
            </Text>

            <Pressable onPress={() => router.replace("/login")}>
              <Text className="text-sm font-semibold text-primary">
                Sign in
              </Text>
            </Pressable>
          </View>

          <Text className="max-w-sm text-center text-xs leading-4 text-muted-foreground">
            By creating an account, you agree to the Terms of Service and
            acknowledge the Privacy Policy.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
