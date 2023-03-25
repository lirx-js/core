import { rename } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDirectory, exploreDirectory } from '../../misc/fs-helpers.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT_PATH = join(__dirname, '../../../../');
const DIST_PATH = join(ROOT_PATH, 'dist');

async function renameMJSFile(jsFilePath) {
  const jsFilePathWithoutExtension = jsFilePath.slice(0, -3);
  const mjsFilePath = `${ jsFilePathWithoutExtension }.mjs`;

  await rename(jsFilePath, mjsFilePath);
}


function renameMjs() {
  return createDirectory(DIST_PATH)
    .then(() => {
      return exploreDirectory(DIST_PATH, (entryPath, entry) => {
        if (entry.isFile()) {
          if (!entryPath.includes('/cjs/')) {
            if (entryPath.endsWith('.js')) {
              return renameMJSFile(entryPath);
            }
          }
        }
      });
    });
}

renameMjs()
  .catch((error) => {
    console.error(error);
  });


