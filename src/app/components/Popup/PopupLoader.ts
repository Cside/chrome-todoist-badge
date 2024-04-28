import { redirect } from "react-router-dom";
import { storage } from "wxt/storage";
import { STORAGE_KEY_FOR } from "../../../storage/storageKeys";

export const PopupLoader = async () => {
  if ((await storage.getItem(STORAGE_KEY_FOR.CONFIG.IS_INITIALIZED)) === undefined)
    return redirect("/options");

  return null;
};
