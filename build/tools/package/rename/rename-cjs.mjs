import { rename } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDirectory, exploreDirectory } from '../../misc/fs-helpers.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT_PATH = join(__dirname, '../../../../');
const DIST_PATH = join(ROOT_PATH, 'dist');
const DIST_CJS_PATH = join(DIST_PATH, 'cjs');

async function renameCJSFile(jsFilePath) {
  const newPath = `${ jsFilePath.slice(0, -3) }.cjs`;
  await rename(jsFilePath, newPath);
}

function renameCjs() {
  return createDirectory(DIST_CJS_PATH)
    .then(() => {
      return exploreDirectory(DIST_CJS_PATH, (entryPath, entry) => {
        if (entry.isFile()) {
          if (entryPath.endsWith('.js')) {
            return renameCJSFile(entryPath);
          }
        }
      });
    });
}

renameCjs()
  .catch((error) => {
    console.error(error);
  });


