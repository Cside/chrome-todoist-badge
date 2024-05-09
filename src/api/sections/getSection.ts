import { API_REST_BASE_URL } from "../../constants/urls";
import type { Section, SectionId } from "../../types";
import { ky } from "../ky";

export const getSection = async (sectionId: SectionId) =>
  await ky.getCamelized<Section>(`${API_REST_BASE_URL}/sections/${sectionId}`);
