import { API_URL_FOR } from "@/src/constants/urls";
import { kyInstance } from "../kyInstance";
import type { Section } from "../types";

export const getSections = async ({ projectId }: { projectId: string }) =>
  (await kyInstance.get(API_URL_FOR.GET_SECTIONS_BY(projectId)).json()) as Section[];
