import { API_URL_FOR } from "@/src/constants/urls";
import { ky } from "../ky";
import type { Section } from "../types";

export const getSections = async ({ projectId }: { projectId: string }) =>
  await ky.getCamelized<Section[]>(API_URL_FOR.GET_SECTIONS_BY(projectId));
