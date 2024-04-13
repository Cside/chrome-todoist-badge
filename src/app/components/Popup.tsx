import { Link } from "react-router-dom";

export default function Popup() {
  return (
    <div>
      <p>This is Popup</p>
      <Link to="/options">Options</Link>
    </div>
  );
}
