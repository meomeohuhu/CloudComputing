import { Network } from "@capacitor/network";
import { addToHistory, getQueue, saveQueue } from "./storage";
import type { InspectionRecord } from "./types";

export async function getOnlineStatus(): Promise<boolean> {
  try {
    const status = await Network.getStatus();
    return status.connected;
  } catch {
    return navigator.onLine;
  }
}

export async function submitInspection(record: InspectionRecord): Promise<InspectionRecord> {
  const online = await getOnlineStatus();

  if (!online) {
    throw new Error("Thi\u1ebft b\u1ecb \u0111ang ngo\u1ea1i tuy\u1ebfn");
  }

  await new Promise((resolve) => window.setTimeout(resolve, 450));

  return {
    ...record,
    status: "SYNCED",
    updatedAt: new Date().toISOString()
  };
}

export async function syncPendingInspections(): Promise<InspectionRecord[]> {
  const records = await getQueue();
  const remaining: InspectionRecord[] = [];
  const synced: InspectionRecord[] = [];

  for (const record of records.reverse()) {
    try {
      const syncedRecord = await submitInspection(record);
      synced.push(syncedRecord);
      await addToHistory(syncedRecord);
    } catch {
      remaining.unshift({
        ...record,
        status: "FAILED",
        updatedAt: new Date().toISOString()
      });
    }
  }

  await saveQueue(remaining);
  return synced;
}

export async function registerBackgroundSync(): Promise<void> {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  const syncManager = "sync" in registration ? registration.sync : undefined;

  if (syncManager) {
    await syncManager.register("sync-inspections");
  }
}
