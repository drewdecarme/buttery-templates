import { ensureDir } from "fs-extra";

import { readdir } from "node:fs/promises";
import path from "node:path";

import { ButteryIconsDirectories } from "../config/getButteryIconsDirectories";
import { LOG } from "../utils/util.logger";

/**
 * Ensures that all of the necessary folders exist and also
 * ensures that there are SVGs
 */
export async function getSVGFilePaths(dirs: ButteryIconsDirectories) {
  // ensure the dirs are there
  LOG.debug("Ensuring root icon & svg directories exist...");
  await ensureDir(dirs.svg);
  LOG.debug("Ensuring root icon & svg directories exist... done.");

  // check for svgs
  LOG.debug(`Checking ${dirs.svg} for raw svgs...`);
  const dirents = await readdir(dirs.svg, {
    withFileTypes: true,
    recursive: true,
  });
  const rawSvgFiles = dirents.filter(
    (dirent) => dirent.isFile() && path.extname(dirent.name) === ".svg"
  );
  LOG.debug(
    `Checking ${dirs.svg} for raw svgs... Found ${rawSvgFiles.length}.`
  );
  return rawSvgFiles;
}
