import camelcaseKeysDeep from "camelcase-keys-deep";

export const camelizeKeys = (obj: unknown) => camelcaseKeysDeep(obj);
