import { HASH_TO } from "@/src/constants/paths";
import { useIsOnToolbar_Suspended } from "@/src/hooks/useIsOnToolbar";
import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function PinExtensionToToolbar() {
  const isOnToolbar = useIsOnToolbar_Suspended();
  const navigate = useNavigate();

  useEffect(() => navigate(HASH_TO.WELCOME), [isOnToolbar]);

  return (
    <>
      <h1>Pin extension to menu bar</h1>
      <ol>
        <li>Click the puzzle piece in the browser menu</li>
        {/* TODO: Edge 用の画像… */}
        <li>
          Click the pin beside the extensions to keep it on the menu bar (Edge users will see an eye
          icon)
        </li>
      </ol>
      <NavLink to={HASH_TO.WELCOME} className="btn btn-secondary">
        Back
      </NavLink>
    </>
  );
}
