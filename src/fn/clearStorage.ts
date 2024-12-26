import { HTTPError } from "ky";
import { STATUS_CODE_FOR } from "../constants/statusCodes";
import { API_PATH_FOR, API_REST_BASE_URL } from "../constants/urls";
import { ProjectIdNotFoundError } from "../errors";

const isBadRequestErrorForTaskFetch = (error: unknown): error is HTTPError =>
  error instanceof HTTPError &&
  error.response.status === STATUS_CODE_FOR.BAD_REQUEST &&
  error.request.url.replace(/\?.*$/, "") ===
    `${API_REST_BASE_URL}${API_PATH_FOR.GET_TASKS}`;

export const shouldClearStorage = (
  error: unknown,
): error is HTTPError | ProjectIdNotFoundError =>
  // NOTE: ここの条件を増やす際は clearStorage にも同じ条件を追加する
  isBadRequestErrorForTaskFetch(error) || error instanceof ProjectIdNotFoundError;

// NOTE: ここの条件を増やす際は clearStorage にも同じ条件を追加する
export const clearStorage = async (error: HTTPError | ProjectIdNotFoundError) => {
  const keys = await chrome.storage.local.getKeys();
  if (keys.length === 0) return;

  const keysString = `[${keys.join(", ")}]`;

  if (error instanceof HTTPError) {
    if (error.response.bodyUsed) {
      console.error("bodyUsed is already true");
      throw error;
    }

    // NOTE: 他にも Error の body を読むところが出てきたら、共通化する
    const responseText = await error.response.text();
    if (responseText !== "The search query is incorrect") {
      console.error(
        `Error message is not "The search query is incorrect". message: ${responseText}`,
      );
    }
    await chrome.storage.local.clear();
    console.error(
      `Bad request. storage was cleared. url: ${error.response.url}, message: ${error.message}, keys: ${keysString}`,
    );
  } else {
    await chrome.storage.local.clear();
    console.error(
      `${error.name}. storage was cleared. message: ${error.message}, keys: ${keysString}`,
    );
  }

  // noop
};
