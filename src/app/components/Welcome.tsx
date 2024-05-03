import { Suspense } from "react";
import React from "react";
import { NavLink } from "react-router-dom";
import { name as TITLE } from "../../../package.json";
import { PATH_TO } from "../../constants/paths";
import { useIsOnToolbar_Suspended } from "../../hooks/useIsOnToolbar";
import * as storage from "../../storage/useStorage";
import { Spinner } from "./Spinner";

const Checked = React.memo(({ children }: { children: string }) => (
  <div>
    ✅ <span className="text-neutral-400 line-through">{children}</span>
  </div>
));

const Main_Suspended = () => {
  const [isConfigInitialized] = storage.useIsConfigInitialized_Suspended();
  const isOnToolbar = useIsOnToolbar_Suspended();

  const MESSAGE_FOR = {
    PIN_EXTENSION_TO_TOOLBAR: "Pin extension to toolbar",
    OPTIONS: "Configure extension",
  };
  return (
    <>
      <div className="flex flex-col items-start gap-y-3">
        {isOnToolbar ? (
          <Checked>{MESSAGE_FOR.PIN_EXTENSION_TO_TOOLBAR}</Checked>
        ) : (
          <NavLink to={PATH_TO.PIN_EXTENSION_TO_TOOLBAR} className="btn btn-primary">
            {MESSAGE_FOR.PIN_EXTENSION_TO_TOOLBAR}
          </NavLink>
        )}
        {isConfigInitialized ? (
          <Checked>{MESSAGE_FOR.OPTIONS}</Checked>
        ) : (
          <NavLink to={PATH_TO.OPTIONS} className="btn btn-primary">
            {MESSAGE_FOR.OPTIONS}
          </NavLink>
        )}
      </div>
    </>
  );
};

export default function Welcome() {
  return (
    <>
      <h1>Let's set up {TITLE}!</h1>
      <Suspense fallback={<Spinner className="ml-16" />}>
        <Main_Suspended />
      </Suspense>
    </>
  );
}
