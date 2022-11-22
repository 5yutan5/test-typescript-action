export enum State {
  CACHE_SEARCH_KEY = "",
  CACHE_MATCHED_KEY = "poetry-cache-matched-key",
  CACHE_PATHS = "poetry-cache-paths",
}

export const IS_WINDOWS = process.platform === "win32";
export const IS_LINUX = process.platform === "linux";
export const IS_MAC = process.platform === "darwin";
