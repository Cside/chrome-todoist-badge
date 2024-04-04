import type { ContentScriptContext } from "wxt/client";
import "./styles.css";

const NAVIGATION_SELECTOR = '[role="navigation"]';

export const mount = async (ctx: ContentScriptContext) => {
  // 3. Define your UI
  const ui = await createShadowRootUi(ctx, {
    name: "todoist-badge-button",
    position: "inline",
    anchor: NAVIGATION_SELECTOR,
    append: "last",
    onMount: (container: HTMLElement) => {
      const a = document.createElement("a");
      a.href = "#";
      a.textContent = "🌳 Todoist Badge";
      a.addEventListener("click", async () => await chrome.runtime.openOptionsPage());
      container.append(a);
    },
  });
  await waitFor(NAVIGATION_SELECTOR);
  ui.mount();
};

const GET_ELEMENT_INTERVAL = 100;
const TIMEOUT = 15 * 1_000;

export const waitFor = (selector: string): Promise<HTMLElement> => {
  return new Promise((resolve) => {
    const getElement = (fn?: () => void) => {
      const $elem = document.querySelector<HTMLElement>(selector);
      if ($elem) {
        if (fn) fn();
        resolve($elem);
      }
    };
    getElement();

    let elapsed = 0;
    const id = setInterval(() => {
      elapsed += GET_ELEMENT_INTERVAL;
      if (elapsed >= TIMEOUT) {
        console.error(`# Timeout for ${selector}`);
        clearInterval(id);
        return;
      }
      getElement(() => {
        clearInterval(id);
      });
    }, GET_ELEMENT_INTERVAL);
  });
};
