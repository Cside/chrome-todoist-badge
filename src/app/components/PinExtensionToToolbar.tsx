import chromeThumbnail from "@/assets/images/pin/chrome.webp";
import edgeThumbnail from "@/assets/images/pin/edge.webp";
import { useUserAgent } from "@oieduardorabelo/use-user-agent";
import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { PATH_TO } from "../../constants/paths";
import { useIsOnToolbar_Suspended } from "../../hooks/useIsOnToolbar";

export default function PinExtensionToToolbar() {
  const isOnToolbar = useIsOnToolbar_Suspended();
  const navigate = useNavigate();
  const usDetails = useUserAgent(navigator.userAgent);

  useEffect(() => {
    if (isOnToolbar) navigate(PATH_TO.WELCOME);
  }, [isOnToolbar]);

  return (
    <>
      <p className="mb-0 font-medium text-xl">Pin this extension to your toolbar to get started.</p>
      <div>
        {usDetails !== null && (
          <img src={usDetails.browser.name === "Edge" ? edgeThumbnail : chromeThumbnail} />
        )}
      </div>

      <NavLink to={PATH_TO.WELCOME} className="btn btn-secondary">
        Back
      </NavLink>
    </>
  );
}
