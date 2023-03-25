import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT_PATH = join(__dirname, '../../../');
const DIST_PATH = join(ROOT_PATH, 'dist');


function bumpPackageVersion() {
  return readFile(join(DIST_PATH, 'package.json'), { encoding: 'utf8' })
    .then((content) => {
      const packageJson = JSON.parse(content);

      const match = /^(\d+\.\d+\.\d+)/.exec(packageJson.version);

      if (match === null) {
        throw new Error(`Invalid version: ${ packageJson.version }`);
      }

      const pkg = {
        ...packageJson,
        version: `${ match[1] }-dev.${ Date.now() }`,
      };

      return writeFile(join(DIST_PATH, 'package.json'), JSON.stringify(pkg, null, 2));
    });
}

bumpPackageVersion()
  .catch((error) => {
    console.error(error);
  });


