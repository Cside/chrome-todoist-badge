import { HASH_TO } from "@/src/constants/paths";
import { NavLink } from "react-router-dom";

export default function Welcome() {
  return (
    <>
      <h1>Let's set up Todoist Badge!</h1>
      <div className="flex flex-col items-start gap-y-3">
        <NavLink to={HASH_TO.PIN_EXTENSION_TO_TOOLBAR} className="btn btn-primary">
          Pin extension to toolbar
        </NavLink>
        <NavLink to={HASH_TO.OPTIONS} className="btn btn-primary">
          Configure extension
        </NavLink>
      </div>
    </>
  );
}
