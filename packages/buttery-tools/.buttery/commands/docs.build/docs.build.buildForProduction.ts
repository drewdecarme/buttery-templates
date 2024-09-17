import path from "node:path";
import { exhaustiveMatchGuard } from "@buttery/utils/ts";

import { cp, readdir } from "node:fs/promises";
import { runCommand } from "../_utils/util.run-command";
import type { ButteryDocsConfig } from "../docs/docs.getButteryDocsConfig";
import { getButteryDocsDirectories } from "../docs/docs.getButteryDocsDirectories";
import { LOG_DOCS } from "../docs/docs.logger";

export const buildForProduction = async (config: ButteryDocsConfig) => {
  const butteryDirs = await getButteryDocsDirectories(config);
  LOG_DOCS.debug("Building distribution files...");

  try {
    switch (config.docs.buildTarget) {
      case "cloudflare-pages": {
        const configFile = path.resolve(
          butteryDirs.lib.apps.generated.root,
          "./vite.config.ts"
        );
        process.env.REMIX_ROOT = butteryDirs.lib.apps.generated.root;

        await runCommand(
          `npx remix vite:build --config ${configFile} --emptyOutDir --logLevel=error`
        );

        // Move the build to the local dist
        await cp(
          path.resolve(butteryDirs.lib.apps.generated.root, "./build"),
          path.resolve(butteryDirs.output.root, "./build"),
          {
            recursive: true
          }
        );

        // move functions to local dist
        const functionsDir = path.resolve(
          butteryDirs.lib.apps.generated.root,
          "./functions"
        );
        await cp(
          functionsDir,
          path.resolve(butteryDirs.output.root, "./functions"),
          {
            recursive: true
          }
        );

        break;
      }

      default:
        exhaustiveMatchGuard(config.docs.buildTarget);
    }

    const filesAndDirs = await readdir(butteryDirs.output.root, {
      recursive: true,
      withFileTypes: true
    });

    const files = filesAndDirs.filter((dirent) => dirent.isFile());
    LOG_DOCS.success(`Successfully built documentation app!

  Location: ${butteryDirs.output.root}
  Total Files: ${files.length}

${files.reduce((accum, file) => accum.concat(`    - ${path.relative(butteryDirs.output.root, `${file.parentPath}/${file.name}`)}\n`), "")}      
`);
  } catch (error) {
    throw LOG_DOCS.fatal(new Error(error as string));
  }
};
