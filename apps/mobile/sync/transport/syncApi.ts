import { authClient } from "@/lib/auth/auth-client";
import { SyncRequest, SyncResponse } from "../types";

export default async function sendSyncRequest(
  request: SyncRequest,
): Promise<SyncResponse> {
  const { data: tokenData, error: tokenError } = await authClient.token();

  if (tokenError || !tokenData.token) {
    throw new Error(
      tokenError?.message ?? "An authentication token is unavailable.",
    );
  }

  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/sync`, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${tokenData.token}`,

      "Content-Type": "application/json",
    },

    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Sync failed with ${response.status}}`);
  }

  return (await response.json()) as SyncResponse;
}
