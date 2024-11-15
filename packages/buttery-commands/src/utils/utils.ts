import { ButteryLogger } from "@buttery/core/logger";
import type { BuildOptions } from "esbuild";
import type { CommandArgs, CommandOptions } from "../lib/library";

// ---- Start Types ----
export type CommandsBuildOptions = {
  watch: boolean;
  local: boolean;
  autofix?: boolean;
};

export type ButteryCommand = {
  /**
   * The relative path of the command file to the
   * commands input and also the commands output dir
   */
  id: string;
  /**
   * The name of the command that will call
   */
  name: string;
  /**
   * Describes what the command does
   */
  description: string;
  /**
   * The segments of the command path
   */
  segments: string[];
  /**
   * Options that can be passed to the command action
   */
  options: CommandOptions;
  /**
   * Positional args that can be passed to the command action
   */
  args: CommandArgs | undefined;
  /**
   * The path that the module is output to
   */
  path: string;
  /**
   * The sub-commands of the command
   */
  subCommands: ButteryCommandsGraph;
  /**
   * A string literal representation of the help menu
   */
  help: string;
  /**
   * Other information to help parse and validate the command
   */
  meta: {
    /**
     * An array of command ids that are parent to this command
     */
    parentCommands: string[];
    /**
     * The level that the command sits at
     */
    level: number;
    /**
     * Boolean that represents the existence of an action
     * in the command file.
     */
    hasAction: boolean;
  };
};

export type ButteryCommandsGraph = {
  [key: string]: ButteryCommand;
};

export type ButteryCommandsManifest = Map<string, ButteryCommand>;
// ---- End Types ----

export const defaultCommandOptions: CommandOptions = {
  help: {
    type: "boolean",
    required: false,
    alias: "h",
    description: "Display the help menu",
  },
};

export const defaultEsbuildOptions: BuildOptions = {
  bundle: true,
  minify: true,
  format: "esm",
  platform: "node",
  target: ["node22.9.0"],
  packages: "external",
};

export const LOG = new ButteryLogger({
  id: "buttery-commands",
  prefix: "buttery:commands",
  prefixBgColor: "#e3d01c",
  logLevel: "debug",
});

/**
 * Dynamically import a file by cache busting the import
 * cache by adding a number representation of now. This forces
 * import to go out and fetch a new instance.
 */
export async function dynamicImport<T extends Record<string, unknown>>(
  modulePath: string
) {
  // Construct a new import specifier with a unique URL timestamp query parameter
  const timestamp = new Date().getTime();
  const importSpecifier = `${modulePath}?t=${timestamp}`;

  // Import the module fresh
  return (await import(importSpecifier)) as T;
}
