import messages from "../../public/_locales/en/messages.json";

export const EXTENSION_NAME = (() => {
  const name = messages.extensionName.message;
  if (/[-:：]/.test(name))
    throw new Error(`Invalid character in extension name: "${name}"`);
  return name;
})();
