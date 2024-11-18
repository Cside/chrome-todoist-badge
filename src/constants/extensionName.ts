import messages from "../localizationMessages.json";

export const EXTENSION_NAME = (() => {
  const name = messages.extensionName.message;
  if (/[-:：]/.test(name))
    throw new Error(`Invalid character in extension name: "${name}"`);
  return name;
})();
