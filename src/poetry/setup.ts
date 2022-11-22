import * as io from "@actions/io";
import * as exec from "@actions/exec";

import { Configuration, configurePoetry } from "./config";
import { tryRestoringCache } from "./restore";

async function installPoetry(version: string): Promise<void> {
  const pythonLocation = await io.which("python", true);
  const { exitCode, stderr } = await exec.getExecOutput(
    "pipx",
    pythonLocation
      ? ["install", `poetry==${version}`, "--python", pythonLocation]
      : ["install", `poetry==${version}`]
  );

  if (exitCode && stderr) {
    throw new Error(
      `Could not install poetry v(${version}) with pipx: ${stderr}`
    );
  }
}

export async function setupPoetry(
  version: string,
  config: Configuration
): Promise<void> {
  const success = await tryRestoringCache(version);
  if (!success) await installPoetry(version);
  await configurePoetry(config);
}
