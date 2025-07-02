import { SECTION_ID_FOR_STORAGE } from "../../constants/options";
import type { Api, SectionId } from "../../types";
import { ky } from "../ky";

export const getSection = async (sectionId: SectionId) => {
  if (sectionId === SECTION_ID_FOR_STORAGE.NO_PARENT)
    throw new Error(`sectionId is ${sectionId}`);

  return await ky.fetchAndNormalize<Api.Section>(`/sections/${sectionId}`);
};
