import { getButteryConfig } from "@buttery/core";
import { LOG } from "../_utils/util.logger";

import { buildCommandsCleanDistributionDirs } from "./build-commands.clean-distribution-dirs";
import { buildCommandsCreateBinary } from "./build-commands.create-binary";
import { buildCommandsEnrichPackageJson } from "./build-commands.enrich-package-json";

import type {
  BuildCommandsFunctionArgs,
  BuildCommandsOptions,
} from "./build-commands.utils";
/**
 * This function is the main build command that reads the .buttery/config
 * parses the commands directory and then builds the binary. This command
 * is also used locally to build the commands that build the commands.
 */
export async function buildCommands(options: BuildCommandsOptions) {
  LOG.level = "info";
  const config = await getButteryConfig("cli");
  LOG.debug(`Using config: ${config.paths.config}`);

  const args: BuildCommandsFunctionArgs = {
    config,
    options,
  };

  // clean the distribution dirs
  // await buildCommandsCleanDistributionDirs(args);

  // enrich the local package.json and build the binary directory
  await Promise.all([
    // buildCommandsEnrichPackageJson(args),
    buildCommandsCreateBinary(args),
  ]);
}
