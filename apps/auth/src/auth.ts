import "dotenv/config";
import { betterAuth } from "better-auth";
import { expo } from "@better-auth/expo";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.AUTH_DATABASE_URL,
  }),

  emailAndPassword: {
    enabled: true,
  },

  trustedOrigins: [
    "ascora://",
    "ascora://*",

    ...(process.env.NODE_ENV === "development"
      ? ["exp://", "exp://**", "http://localhost:8081"]
      : []),
  ],

  plugins: [
    expo(),
    jwt({
      jwt: {
        issuer: process.env.BETTER_AUTH_URL,
        audience: process.env.ASCORA_API_AUDIENCE,
        expirationTime: "15m",
      },
    }),
  ],
});
