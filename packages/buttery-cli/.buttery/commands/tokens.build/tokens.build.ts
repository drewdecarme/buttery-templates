import { select } from "@inquirer/prompts";
import chokidar from "chokidar";
import { LOG_TOKENS } from "../tokens/tokens.config.logger";
import { createPlaygroundDataFile } from "./tokens.build.create-playground-datafile";
import { launchConfigUI } from "./tokens.build.launch-playground";
import { runBuild } from "./tokens.build.run";
import {
  type ButteryTokensConfig,
  getButteryTokensConfig,
} from "./tokens.config.getButteryTokensConfig";

export type BuildTokensOptions = {
  watch: boolean;
  debug: boolean;
  interactive: boolean;
  prompt: boolean;
};

export async function build(
  options: BuildTokensOptions & {
    /**
     * Not a publicly accessible option. This is used specifically
     * for generating token sets in this CLI for the docs and tokens apps
     * respectively.
     */
    local?: boolean;
  }
) {
  const isLocal = !!options.local;
  const watch = options.watch;
  const interactive = options.interactive;
  const prompt = options.prompt;

  // Get the config
  const config = await getButteryTokensConfig({
    startingDirectory: isLocal ? import.meta.dirname : process.cwd(),
    prompt,
    defaultConfig: "tokens",
  });

  LOG_TOKENS.debug("Building buttery tokens...");
  await runBuild(config, { isLocal });
  LOG_TOKENS.success("Build complete!");

  if (!watch) return;

  let reconciledConfig: ButteryTokensConfig;

  if (interactive) {
    const { tokens, ...restConfig } = config;

    if (Array.isArray(tokens)) {
      LOG_TOKENS.info("Detected more than one tokens configuration.");
      const choice = await select({
        message:
          "Please select which configuration you would like to load into the interactive token config UI",
        choices: tokens.map((tokenConfig, i) => ({
          name: tokenConfig.importName,
          value: i,
        })),
      });
      reconciledConfig = {
        ...restConfig,
        tokens: tokens[choice],
      };
    } else {
      reconciledConfig = {
        ...restConfig,
        tokens,
      };
    }
    launchConfigUI(reconciledConfig, { isLocal });
  }

  // Watch the config anytime it changes
  const watcher = chokidar.watch(config.paths.config);
  LOG_TOKENS.watch(config.paths.config.concat(" for changes..."));

  // When the config changes...
  // re-fetch the config and build the templates
  watcher.on("change", async (file) => {
    LOG_TOKENS.watch(`"${file}" changed.`);
    LOG_TOKENS.watch("Rebuilding tokens...");
    if (interactive) {
      await createPlaygroundDataFile(reconciledConfig, { isLocal });
    }
    await runBuild(config, { isLocal });
    LOG_TOKENS.watch("Rebuilding tokens... done.");
  });
}