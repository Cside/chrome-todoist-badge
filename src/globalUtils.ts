declare global {
  interface Window {
    sl: () => Promise<void>;
    ss: () => Promise<void>;
    sld: (key: string) => Promise<void>;
    ssd: (key: string) => Promise<void>;
  }
}
// console オブジェクトに json()=> string という関数を拡張する型を書いて

/* TODO: background worker で使えない */

// sl = storage local
window.sl = async () => console.table(await chrome.storage.local.get());
window.sld = async (key: string) => await chrome.storage.local.remove(key);
// ss = storage sync
window.ss = async () => console.table(await chrome.storage.sync.get());
window.ssd = async (key: string) => await chrome.storage.sync.remove(key);

export {};
