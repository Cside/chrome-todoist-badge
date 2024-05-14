import { redirect } from "react-router-dom";
import { storage } from "wxt/storage";
import { STORAGE_KEY_FOR } from "../../../storage/storageKeys";

export const PopupLoader = async () => {
  if (
    (await storage.getItem<boolean>(STORAGE_KEY_FOR.CONFIG.IS_INITIALIZED)) === null
  )
    return redirect("/options");

  return null;
};
