import { buildCommands } from "../src/build-commands";
import { LOG } from "../src/utils";

/**
 * Build's the @buttery/commands binary
 */
export async function build() {
  try {
    buildCommands({
      watch: false,
      local: true,
    });
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }
}
