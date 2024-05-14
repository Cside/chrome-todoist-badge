const BADGE_TEXT_COLOR = "#ffffff";
// const BADGE_BACKGROUND_COLOR = "#e8463c"; // same as nova launcher
const BADGE_BACKGROUND_COLOR = "#e54332"; // same as Todoist

export const setBadgeColor = async () => {
  await chrome.action.setBadgeBackgroundColor({
    color: BADGE_BACKGROUND_COLOR,
  });
  await chrome.action.setBadgeTextColor({ color: BADGE_TEXT_COLOR });
};
