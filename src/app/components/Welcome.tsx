import { Suspense } from "react";
import React from "react";
import { NavLink } from "react-router-dom";
import { name as EXTENSION_NAME } from "../../../package.json";
import { PATH_TO } from "../../constants/paths";
import { useIsOnToolbar_Suspended } from "../../hooks/useIsOnToolbar";
import * as storage from "../../storage/useStorage";
import { Spinner } from "./Spinner";

const Checked = React.memo(function Checked({ children }: { children: string }) {
  return (
    <div>
      ✅ <span className="text-neutral-400 line-through">{children}</span>
    </div>
  );
});

const Main_Suspended = () => {
  const [isConfigInitialized] = storage.useIsConfigInitialized_Suspended();
  const isOnToolbar = useIsOnToolbar_Suspended();

  if (isConfigInitialized && isOnToolbar)
    return (
      <>
        <h1>All done! ✅</h1>
        <p>Enjoy {EXTENSION_NAME}!</p>
        <div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => window.close()}
          >
            Close
          </button>
        </div>
      </>
    );

  const MESSAGE_FOR = {
    PIN_EXTENSION_TO_TOOLBAR: "Pin extension to toolbar",
    OPTIONS: "Configure extension",
  };
  return (
    <>
      <h1>Let's set up {EXTENSION_NAME}!</h1>
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
    <Suspense fallback={<Spinner className="ml-16" />}>
      <Main_Suspended />
    </Suspense>
  );
}
