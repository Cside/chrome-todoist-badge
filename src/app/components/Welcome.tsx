import { HASH_TO } from "@/src/constants/paths";
import { useIsOnToolbar_Suspended } from "@/src/hooks/useIsOnToolbar";
import * as storage from "@/src/storage/useStorage";
import { Suspense } from "react";
import React from "react";
import { NavLink } from "react-router-dom";
import { name as TITLE } from "../../../package.json";
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
    PIN: "Pin extension to toolbar",
    CONFIGURE: "Configure extension",
  };
  return (
    <>
      <div className="flex flex-col items-start gap-y-3">
        {isOnToolbar ? (
          <Checked>{MESSAGE_FOR.PIN}</Checked>
        ) : (
          <NavLink to={HASH_TO.OPTIONS} className="btn btn-primary">
            {MESSAGE_FOR.PIN}
          </NavLink>
        )}
        {isConfigInitialized ? (
          <Checked>{MESSAGE_FOR.CONFIGURE}</Checked>
        ) : (
          <NavLink to={HASH_TO.OPTIONS} className="btn btn-primary">
            {MESSAGE_FOR.CONFIGURE}
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
