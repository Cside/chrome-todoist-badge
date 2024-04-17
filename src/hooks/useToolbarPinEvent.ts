import { useIntervalEffect } from "@react-hookz/web";
import { useState } from "react";

const INTERVAL = 500;

export const useToolbarPinEvent = (callback: () => void) => {
  const [enabled, setEnabled] = useState(true);

  useIntervalEffect(
    async () => {
      if ((await chrome.action.getUserSettings()).isOnToolbar) {
        callback();
        setEnabled(false);
      }
    },
    enabled ? INTERVAL : undefined,
  );
};
