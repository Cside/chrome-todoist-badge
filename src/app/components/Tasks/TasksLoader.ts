import { redirect } from "react-router-dom";
import { storage } from "wxt/storage";
import { PATH_TO } from "../../../constants/paths";
import { STORAGE_KEY_FOR } from "../../../storage/storageKeys";

export const TasksLoader = async () => {
  if (
    (await storage.getItem<boolean>(STORAGE_KEY_FOR.CONFIG.IS_INITIALIZED)) === null
  )
    return redirect(PATH_TO.OPTIONS);

  return null;
};
