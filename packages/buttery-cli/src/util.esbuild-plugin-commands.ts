import type { Plugin } from "esbuild";
import { access, constants, readFile, writeFile } from "fs/promises";
import handlebars from "handlebars";
import path from "path";
import {
  CLIConfig,
  CommandAction,
  CommandArgs,
  CommandMeta,
  CommandOptions,
} from "../lib";
import { createEsbuildOptions } from "./config.esbuild";
import * as esbuild from "esbuild";
import { exhaustiveMatchGuard } from "./util.exhaustive-match-guard";

export type EntryTemplateData = {
  cli_name: string;
  cli_description: string;
  cli_version?: string;
  cli_commands: string;
};

type CommandProperties = {
  segment_name: string;
  meta: CommandMeta;
  options?: CommandOptions<"">;
  args?: CommandArgs;
  action?: CommandAction;
};

type CommandObject = {
  [key: string]: {
    properties: {};
    commands: CommandObject;
  };
};

/**
 * TODO: Update this description
 */
export class ESBuildPluginCommands {
  config: CLIConfig;
  private runNumber: number;
  private commandFilesSrcDir: string;
  private commandFilesOutDir: string;
  private commandFiles: Set<string>;
  private commandGraph: CommandObject;
  private commandStr: string;

  constructor(config: CLIConfig) {
    this.config = config;
    this.runNumber = 0;
    this.commandFiles = new Set();
    this.commandGraph = {};
    this.commandStr = "";

    this.commandFilesSrcDir = path.resolve(this.config.root, "./commands");
    this.commandFilesOutDir = path.resolve(this.config.root, "./bin/commands");
  }

  private kebabToCamel(kebab: string): string {
    return kebab.replace(/-([a-z0-9])/g, (_, match) => match.toUpperCase());
  }

  private appendCommandStr(str: string) {
    this.commandStr += str;
  }

  /**
   * Returns the commands directory path that was configured
   * by the `buttery.config`
   */

  private getCommandFileName(commandFilePath: string) {
    return path.basename(commandFilePath, ".ts");
  }

  /**
   * Dynamically import a command by cache busting the import
   * cache by adding a number representation of now. This forces
   * import to go out and fetch a new instance.
   */
  private async importCommand(modulePath: string) {
    // Construct a new import specifier with a unique URL timestamp query parameter
    const timestamp = new Date().getTime();
    const importSpecifier = `${modulePath}?t=${timestamp}`;

    // Import the module fresh
    return await import(importSpecifier);
  }

  /**
   * Creates files that might be missing from the command hierarchy
   */
  private async ensureCommandFile(
    commandSegment: string,
    commandSegmentPathSrc: string
  ) {
    const segmentCommandName = this.getCommandFileName(commandSegmentPathSrc);
    this.commandFiles.add(segmentCommandName);

    try {
      await access(commandSegmentPathSrc, constants.F_OK);
    } catch (error) {
      console.log(error);
      console.info(`Cannot locate command file for '${segmentCommandName}'`);
      console.log("Auto creating command file with default values...");
      // TODO: Put any prompting behind --autofix
      const commandParentTemplate = await readFile(
        path.resolve(
          import.meta.dirname,
          "../templates/template.command-parent.hbs"
        ),
        { encoding: "utf-8" }
      );
      const template = handlebars.compile<{ command_name: string }>(
        commandParentTemplate.toString()
      )({ command_name: commandSegment });
      await writeFile(
        path.resolve(this.commandFilesSrcDir, `./${segmentCommandName}.ts`),
        template,
        { encoding: "utf-8" }
      );
      console.log("Auto creating command file with default values... done.");
      console.warn(
        "A stub file has been created for you. You should ensure that you create the command in the commands dir. If you want to do this automatically then use --autofix"
      );
    }
  }

  /**
   * Get's all of the existing command files, loops through
   * them and ensures that all of the proper files have been created
   */
  private async ensureCommandHierarchy(commandFilePath: string) {
    const commandFileName = this.getCommandFileName(commandFilePath);
    const commandSegments = commandFileName.split(".");

    for (const commandSegmentIndex in commandSegments) {
      const commandSegment = commandSegments[commandSegmentIndex];
      const commandSegmentName = commandSegments
        .slice(0, Number(commandSegmentIndex) + 1)
        .join(".");
      const commandSegmentPath = `${this.commandFilesSrcDir}/${commandSegmentName}.ts`;
      await this.ensureCommandFile(commandSegment, commandSegmentPath);
    }
  }

  /**
   * Creates a deeply nested graph of all of the commands
   * and their associated child commands. This is done
   * so that we can recursively build the commander program
   * by processing the commands key.
   */
  private async createCommandGraph() {
    const commandFiles = [...this.commandFiles.values()];

    for (const commandFileName of commandFiles) {
      const commandSegments = commandFileName.split(".");
      let currentCommandGraph = this.commandGraph;

      for (const commandSegment of commandSegments) {
        try {
          const commandFilePath = path.resolve(
            this.commandFilesOutDir,
            `./${commandFileName}.js`
          );
          const commandFileContent = await this.importCommand(commandFilePath);
          const properties: CommandProperties = {
            meta: commandFileContent?.meta,
            segment_name: commandFileName,
            action: commandFileContent?.action,
            args: commandFileContent?.args,
            options: commandFileContent?.options,
          };
          if (!currentCommandGraph[commandSegment]) {
            currentCommandGraph[commandSegment] = {
              properties,
              commands: {},
            };
          }
        } catch (error) {
          throw error;
        }

        currentCommandGraph = currentCommandGraph[commandSegment].commands;
      }
    }
  }

  /**
   * Recursively builds a commander string in order to be
   * interpolated onto the index template. This string
   * recursively loops through all of the command relationships
   * in order to build the program string.
   */
  private buildCommands(cmdObj: CommandObject, parentCmd: string) {
    Object.entries(cmdObj).forEach(([cmdName, { commands, properties }]) => {
      const cmdVariableName = this.kebabToCamel(cmdName);
      const hasSubCommands = Object.values(commands).length > 0;
      this.appendCommandStr(
        `const ${cmdVariableName} = ${parentCmd}.command("${cmdName}")`
      );

      const props = properties as CommandProperties;

      // meta
      this.appendCommandStr(`.description("${props.meta.description}")`);

      // args
      const commandArgs = props.args ?? [];
      commandArgs.forEach((arg) => {
        const argName = arg.required ? `<${arg.name}>` : `[${arg.name}]`;
        this.appendCommandStr(
          `.argument(${argName}, ${arg.description}, ${arg.defaultValue})`
        );
      });

      // options
      const commandOptions = props.options ?? ({} as CommandOptions<"">);
      Object.entries(commandOptions).forEach(([flag, option]) => {
        switch (option.type) {
          case "value": {
            return this.appendCommandStr(`.option(
                  "-${option.alias}, --${flag} <value>",
                  "${option.description}"
                )`);
          }

          case "boolean": {
            return this.appendCommandStr(`.option(
                  "-${option.alias}, --${flag}",
                 "${option.description}"
                )`);
          }

          default:
            exhaustiveMatchGuard(option);
            return;
        }
      });

      // no sub commands on this command... an action should exist.
      if (!hasSubCommands) {
        const commandAction = props.action ?? undefined;
        if (commandAction) {
          this.appendCommandStr(
            `.action(withParsedAction("${props.segment_name}"))`
          );
        } else {
          console.warn(
            `"${props.segment_name}" missing an action export. Please export an action.`
          );
        }
      }

      this.appendCommandStr(";");

      return this.buildCommands(commands, cmdVariableName);
    });
  }

  private logRebuild() {
    this.runNumber++;
    console.log(`Building program x${this.runNumber}...`);
  }

  private logBuildComplete() {
    console.log(`Building program x${this.runNumber}... complete.`);
  }

  getPlugin(): Plugin {
    const config = this.config;

    return {
      name: "commands",
      setup: (build) => {
        build.onStart(() => {
          this.logRebuild();
        });
        build.onLoad({ filter: /\/commands\/.*\.ts$/ }, async (args) => {
          // 1. ensure all of the command files exist
          await this.ensureCommandHierarchy(args.path);

          // TODO: Only do this on --local
          // const srcDir = import.meta.dirname;
          // const srcFilesGlob = path.resolve(srcDir, "./**.ts");
          // const srcFiles = glob.sync(srcFilesGlob, { follow: false });

          return undefined;
        });
        build.onEnd(async () => {
          this.logBuildComplete();

          // 2. get all of the command files and then parse them
          await this.createCommandGraph();

          // // 3. build a program by iterating over each file using reduce (since all of the data will have been created at this point and all we're trying to do is create a string)
          this.buildCommands(this.commandGraph, "program");

          // 4. Read the entry template and compile it with the data
          const entryTemplateFile = await readFile(
            path.resolve(import.meta.dirname, "../templates/template.index.hbs")
          );
          const entryTemplate = entryTemplateFile.toString();
          const entryTemplateData: EntryTemplateData = {
            cli_name: config.name,
            cli_description: config.description,
            cli_version: config.version,
            cli_commands: this.commandStr,
          };

          // Reset some internally tracked values
          this.commandGraph = {};
          this.commandStr = "";

          // Compile the template and then build the template to the
          // correct directory
          const template = handlebars.compile<EntryTemplateData>(entryTemplate);
          const templateResult = template(entryTemplateData);

          await esbuild.build({
            ...createEsbuildOptions({
              stdin: {
                contents: templateResult,
                loader: "ts",
              },
              outfile: path.resolve(this.config.root, "./bin/index.js"),
            }),
            bundle: true,
            minify: true,
            external: ["commander"], // externalize commander
          });
        });
      },
    };
  }
}