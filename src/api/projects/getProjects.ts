import { API_URL_FOR } from "../../constants/urls";
import { ky } from "../ky";
import type { Project } from "../types";

export const getProjects = async () => await ky.getCamelized<Project[]>(API_URL_FOR.GET_PROJECTS);
