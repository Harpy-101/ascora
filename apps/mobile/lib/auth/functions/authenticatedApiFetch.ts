import { authClient } from "../auth-client";
// import { jwtDecode } from "jwt-decode";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly responseBody: string,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export default async function authenticatedApiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error("EXPO_PUBLIC_API_URL isn't configured");
  }
  console.log(`requested api route: ${API_URL}${path}`);

  const { data: tokenData, error: tokenError } = await authClient.token();

  if (tokenError || !tokenData.token) {
    throw new Error(
      tokenError?.message ?? "An authentication token is unavailable.",
    );
  }

  //   const header = jwtDecode<{
  //     alg?: string;
  //     kid?: string;
  //   }>(tokenData.token, {
  //     header: true,
  //   });

  //   console.log({
  //     algorithm: header.alg,
  //     hasKeyId: Boolean(header.kid),
  //   });

  const headers = new Headers(init.headers);

  headers.set("Authorization", `Bearer ${tokenData.token}`);
  headers.set("Accept", "application/json");

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  const responseBody = await response.text();

  if (!response.ok) {
    console.error("Authenticated request rejected", {
      status: response.status,
      authenticate: response.headers.get("www-authenticate"),
      responseBody,
    });
    throw new ApiRequestError(
      `API request failed with status ${response.status}.`,
      response.status,
      responseBody,
    );
  }

  if (!responseBody) {
    return undefined as T;
  }

  return JSON.parse(responseBody) as T;
}
