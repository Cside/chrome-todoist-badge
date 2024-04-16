import { STORAGE_KEY_FOR } from "@/src/constants/storageKeys";
import { redirect } from "react-router-dom";
import { storage } from "wxt/storage";

export const PopupLoader = async () => {
  if (!(await storage.getItem(STORAGE_KEY_FOR.CONFIG.IS_INITIALIZED))) {
    return redirect("/options");
  }
  return null;
};
