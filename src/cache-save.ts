import * as core from "@actions/core";
import * as cache from "@actions/cache";

import { State } from "./util";

export async function run() {
  try {
    const cachePaths = JSON.parse(core.getState(State.CACHE_PATHS)) as string[];
    const searchKey = core.getState(State.CACHE_SEARCH_KEY);
    const matchedKey = core.getState(State.CACHE_MATCHED_KEY);

    if (searchKey == matchedKey) {
      core.info(
        `Cache hit occurred on the primary key ${searchKey}, not saving cache.`
      );
      return;
    }

    const cacheId = await cache.saveCache(cachePaths, searchKey);
    if (cacheId == -1) core.warning("Failed to cache Poetry program.");
    else core.info(`Poetry program saved with the key: ${searchKey}`);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
