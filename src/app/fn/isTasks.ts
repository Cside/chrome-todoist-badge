import { PATHNAME_FOR } from "../../constants/paths";

// hook にした方が良いかも？ と思ったが、今のところは関数のほうが使い勝手が良いので。
export const isTasks = () => location.pathname === PATHNAME_FOR.TASKS;
