import { HASH_TO } from "@/src/constants/paths";
import { useToolbarPinEvent } from "@/src/hooks/useToolbarPinEvent";
import { NavLink, useNavigate } from "react-router-dom";

export default function PinExtensionToToolbar() {
  const navigate = useNavigate();

  useToolbarPinEvent(() => navigate(HASH_TO.WELCOME));

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
