import { SECTION_ID_FOR } from "../../constants/options";
import { API_REST_BASE_URL } from "../../constants/urls";
import type { Section, SectionId } from "../../types";
import { ky } from "../ky";

export const getSection = async (sectionId: SectionId) => {
  if (sectionId === SECTION_ID_FOR.NO_PARENT)
    throw new Error(`sectionId is ${sectionId}`);

  return await ky.getCamelized<Section>(
    `${API_REST_BASE_URL}/sections/${sectionId}`,
  );
};
