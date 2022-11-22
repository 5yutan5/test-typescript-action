import * as core from "@actions/core"
import * as exec from "@actions/exec";

import { State } from "setup-python/src/cache-distributions/cache-distributor";

export interface InstallOption {
  readonly allExtras: string;
  readonly extras: string;
  readonly noRoot: string;
  readonly only: string;
  readonly onlyRoot: string;
  readonly with: string;
  readonly without: string;
  readonly additionalArgs: string;
}

export async function installDependencies(
  option: InstallOption
): Promise<void> {
  const primaryKey = core.getState(State.STATE_CACHE_PRIMARY_KEY);
  const matchedKey = core.getState(State.CACHE_MATCHED_KEY);
  if (primaryKey == matchedKey) {
    "Already cached python dependencies.";
    return;
  }

  let args: string[] = [];
  if (option.allExtras == "true") args.push("--all-extras");
  if (option.extras && option.allExtras != "true")
    args.push("--extras", option.extras);
  if (option.noRoot == "true") args.push("--no-root");
  if (option.only) args.push("--only", option.only);
  if (option.with && !option.only) args.push("--with", option.with);
  if (option.without && !option.only) args.push("--without", option.with);

  if (option.onlyRoot == "true") args = [];

  const exitCode = await exec.exec("poetry", ["install"].concat(args));
  if (exitCode) throw new Error("Failed to install python dependencies.");
}
