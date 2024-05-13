import { API_URL_FOR } from "../../constants/urls";
import type { Project } from "../../types";
import { ky } from "../ky";

export const getProjects = async () =>
  await ky.getCamelized<Project[]>(API_URL_FOR.GET_PROJECTS);
