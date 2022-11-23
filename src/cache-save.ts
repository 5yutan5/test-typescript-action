import * as core from "@actions/core";
import * as cache from "@actions/cache";

import { IS_WINDOWS, setInput, State } from "./util";

async function hackSetupPython() {
  const cache = core.getInput("cache-dependencies") == "true" ? "poetry" : "";
  setInput("cache", cache);
}

export async function run() {
  try {
    hackSetupPython();
    await import("setup-python/src/cache-save");

    if (IS_WINDOWS) {
      core.info("Skip to cache Poetry installation on Windows.")
      return;
    }
    const cachePaths = JSON.parse(core.getState(State.CACHE_PATHS)) as string[];
    const searchKey = core.getState(State.CACHE_SEARCH_KEY);
    const matchedKey = core.getState(State.CACHE_MATCHED_KEY);
    if (searchKey == matchedKey) {
      core.info(
        `Cache hit occurred on the key ${searchKey}, not saving cache.`
      );
      return;
    }

    const cacheId = await cache.saveCache(cachePaths, searchKey);
    if (cacheId == -1) core.warning("Failed to cache Poetry installation.");
    else core.info(`Poetry installation saved with the key: ${searchKey}`);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
