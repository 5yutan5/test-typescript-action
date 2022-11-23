import fs from "node:fs";
import os from "node:os";
import * as io from "@actions/io";
import * as core from "@actions/core";
import { run } from "setup-python/src/setup-python";

import { InstallOption } from "./poetry/install";
import { setInput } from "./util";

interface Inputs {
  readonly architecture: string;
  readonly cache: string;
  readonly cacheDependencyPath: string;
  readonly checkLatest: string;
  readonly token: string;
  readonly updateEnvironment: string;
  readonly version: string;
  readonly versionFile: string;
}

async function createHackDependencyFile(
  option: InstallOption
): Promise<string> {
  let key = "";
  if (option.allExtras == "true") key += option.allExtras;
  if (option.extras && option.allExtras != "true") key += option.extras;
  if (option.noRoot == "true") key += option.noRoot;
  if (option.only) key += option.only;
  if (option.with && !option.only) key += option.with;
  if (option.without && !option.only) key += option.without;

  if (option.onlyRoot == "true") key = option.onlyRoot;

  if (key) {
    const tempDir = core.toPlatformPath(`${os.homedir()}/.setup-poetry-env`);
    await await io.mkdirP(tempDir);
    const keyPath = core.toPlatformPath(`${tempDir}/temp-key.txt`);
    fs.writeFileSync(keyPath, key);
    console.log(keyPath)
    return keyPath;
  } else {
    return "";
  }
}

function overrideInput(inputs: Inputs, hackPath: string): void {
  let cacheDependencyPath = "**/poetry.lock";
  if (inputs.cacheDependencyPath)
    cacheDependencyPath += inputs.cacheDependencyPath;
  if (hackPath) cacheDependencyPath += "\n" + hackPath;

  setInput("architecture", inputs.architecture);
  setInput("cache", inputs.cache);
  setInput("cache-dependency-path", cacheDependencyPath);
  setInput("check-latest", inputs.checkLatest);
  setInput("update-environment", inputs.updateEnvironment);
  setInput("version", inputs.version);
  setInput("version-file", inputs.versionFile);
}

async function hackActionSetupPython(
  option: InstallOption,
  inputs: Inputs
): Promise<void> {
  const hackDependencyPath = await createHackDependencyFile(option);
  overrideInput(inputs, hackDependencyPath);
}

export async function setupPython(
  poetryInstallOption: InstallOption,
  inputs: Inputs
): Promise<void> {
  await hackActionSetupPython(poetryInstallOption, inputs);
  // Run `actions/setup-python`.
  await run();
}
