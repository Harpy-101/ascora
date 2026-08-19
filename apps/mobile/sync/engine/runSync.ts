import sendSyncRequest from "../transport/syncApi";
import applySyncResponse from "./applySyncResponse";
import prepareSyncRequest from "./prepareSyncRequest";

const MAX_SYNC_PASSES = 10;

export default async function ruinSync(userId: string): Promise<void> {
  for (let pass = 0; pass < MAX_SYNC_PASSES; pass++) {
    const prepared = await prepareSyncRequest(userId);

    const response = await sendSyncRequest(prepared.request);

    const result = await applySyncResponse(userId, prepared, response);

    // console.log("Blocked by conflict = ", result.blockedByConflict);
    // console.log("chnages", response.changes);

    if (result.blockedByConflict) {
      return;
    }

    if (!response.hasMore) {
      return;
    }
  }

  throw new Error("Sync exceeded that maximume numvber of passes.");
}
