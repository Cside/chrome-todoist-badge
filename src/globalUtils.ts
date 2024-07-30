declare global {
  interface Window {
    sl: () => Promise<void>;
    ss: () => Promise<void>;
    sld: (key: string) => Promise<void>;
    ssd: (key: string) => Promise<void>;
  }
}

const global = typeof window !== "undefined" ? window : self;

// sl = storage local
global.sl = async () => console.info(await chrome.storage.local.get());
global.sld = async (key: string) => await chrome.storage.local.remove(key);
// ss = storage sync
global.ss = async () => console.table(await chrome.storage.sync.get());
global.ssd = async (key: string) => await chrome.storage.sync.remove(key);

export type {};
