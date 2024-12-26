import { STORAGE_KEY_FOR } from "../storage/storageKeys";

export const isInitialized = async (): Promise<boolean> =>
  (await storage.getItem(STORAGE_KEY_FOR.CONFIG.IS_INITIALIZED)) ?? false;
