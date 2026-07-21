import "dotenv/config";
import { betterAuth } from "better-auth";
import { expo } from "@better-auth/expo";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";
import sendPasswordResetEmail from "./utils/resetPassword/sendPasswordResetEmail";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.AUTH_DATABASE_URL,
  }),

  emailAndPassword: {
    enabled: true,
    resetPasswordTokenExpiresIn: 60 * 60,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      void sendPasswordResetEmail({
        to: user.email,
        resetUrl: url,
      });
    },

    onPasswordReset: async ({ user }) => {
      console.log(`Password reset completed for user ${user.id}`);
    },
  },

  trustedOrigins: [
    "ascora://",
    "ascora://*",

    ...(process.env.NODE_ENV === "development"
      ? [
          "exp://",
          "exp://**",
          "http://localhost:8081",
          "exp://172.20.10.2:8081",
        ]
      : []),
  ],

  plugins: [
    expo(),
    jwt({
      jwt: {
        issuer: process.env.BETTER_AUTH_URL,
        audience: process.env.ASCORA_API_AUDIENCE,
        expirationTime: "15m",

        definePayload: ({ user }) => ({
          email: user.email,
          name: user.name,
        }),
      },
    }),
  ],
});
