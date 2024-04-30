import { cosmiconfig } from "cosmiconfig";
import path from "node:path";
import { CLIConfig } from "./types";
import { glob } from "glob";
import * as esbuild from "esbuild";
import { rimraf } from "rimraf";
import { processBuildArgs } from "./util.parse-build-args";

export async function buildCommands(args: typeof process.argv) {
  const parsedArgs = processBuildArgs(args);

  try {
    // get the buttery configuration file
    const explorer = cosmiconfig("buttery");
    const configResult = await explorer.search();
    if (!configResult) throw new Error("Cannot parse configuration result.");
    const config = configResult.config as CLIConfig;

    // Gather the commands via glob, delete the old ones and build
    // the new ones to the bin. This makes sure that any commands from
    // a previous development instance are completely wiped out and
    // refreshed.
    const commandFilesDir = path.resolve(config.root, "./commands");
    const commandFiles = glob.sync(path.resolve(commandFilesDir, "./*.ts"), {
      follow: false,
    });
    const outDir = path.join(config.root, "./bin/commands");
    const commandOutputFiles = glob.sync(path.resolve(outDir, "./*.js"), {
      follow: false,
    });
    await rimraf(commandOutputFiles);

    // Copy the files in the entry template
    // and replace some of the strings with the values
    // from the buttery config. Namely the CLI name so someone
    // can configure & instantiate the CLI that their building with the name
    // that they want.
    // TODO: FUTURE --- run an init command to prompt the user for these values rather than
    // setting this up manually.

    const esbuildArgs: esbuild.BuildOptions = {
      entryPoints: commandFiles,
      bundle: true,
      minify: true,
      format: "esm",
      platform: "node",
      target: ["node20.11.1"],
      packages: "external",
      outdir: outDir,
    };

    if (parsedArgs.watch) {
      console.log("Running Buttery CLI Builder in DEV mode...");
      const context = await esbuild.context(esbuildArgs);
      await context.watch();
    }
    await esbuild.build(esbuildArgs);
  } catch (error) {
    throw new Error(error as string);
  }
}
