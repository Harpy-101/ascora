import { Controller, useForm } from "react-hook-form";
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "./validation/forgotPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import useForgotPassword from "./hooks/use-forgot-password";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import FormField from "../components/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react-native";

export default function ForgotPasswordScreen() {
  const [requestSent, setRequestSent] = useState(false);
  const forgotPasswordMutation = useForgotPassword();
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const isSubmiting = forgotPasswordMutation.isPending;

  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      forgotPasswordMutation.mutateAsync(values.email);
      setRequestSent(true);
    } catch {
      setRequestSent(true);
    }
  }

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
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Text className="text-xl font-bold text-primary">A</Text>
            </View>
          </View>

          <View className="items-center gap-2">
            <Text variant="h1">Reset your password</Text>
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
                    returnKeyType="done"
                    accessibilityLabel="Email address"
                  />
                </FormField>
              )}
            />

            {requestSent ? (
              <Alert icon={CheckCircle2Icon}>
                <AlertTitle>
                  If this email exists in our system, check your email for the
                  reset link
                </AlertTitle>
              </Alert>
            ) : null}

            <Button onPress={form.handleSubmit(onSubmit)} className="mt-8">
              <Text className="font-semibold">
                {isSubmiting ? "Sending email..." : "Reset password"}
              </Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
