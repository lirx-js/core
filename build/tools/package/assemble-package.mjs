import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { copyFile, createDirectory } from '../misc/fs-helpers.mjs';

// https://docs.skypack.dev/package-authors/package-checks
// https://nodejs.org/api/packages.html#packages_conditional_exports

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT_PATH = join(__dirname, '../../../');
const DIST_PATH = join(ROOT_PATH, 'dist');

function generatePackageJSON() {
  return readFile(join(ROOT_PATH, 'package.json'), { encoding: 'utf8' })
    .then((content) => {
      const packageJson = JSON.parse(content);

      const pkg = {
        ...packageJson,
        type: 'module',
        main: './cjs/index.cjs',
        typings: './index.d.ts',
        module: './index.mjs',
        exports: {
          'import': './index.mjs',
          'require': './cjs/index.cjs',
        },
        resolutions: {},
        devDependencies: {},
      };

      return writeFile(join(DIST_PATH, 'package.json'), JSON.stringify(pkg, null, 2));
    });

}

function generateNPMIgnore() {
  return writeFile(join(DIST_PATH, '.npmignore'), [
    `.npmrc`,
    // `.yarnrc.yml`,
    `yarn.lock`,
    // `package-lock.json`,
    // `.cache`,
    `.cjs-cache`,
    `.mjs-cache`,
  ].join('\n'));
}

function copyEssentialFiles() {
  return Promise.all([
    copyFile(join(ROOT_PATH, 'README.md'), join(DIST_PATH, 'README.md')),
    copyFile(join(ROOT_PATH, 'LICENSE'), join(DIST_PATH, 'LICENSE')),
    //copyFile(join(ROOT_PATH, '.pnp.cjs'), join(DIST_PATH, '.pnp.cjs')),
    //copyFile(join(ROOT_PATH, '.pnp.loader.mjs'), join(DIST_PATH, '.pnp.loader.mjs')),
    //copyFile(join(ROOT_PATH, 'yarn.lock'), join(DIST_PATH, 'yarn.lock')),
    // copyDirectory(join(ROOT_PATH, '.yarn'), join(DIST_PATH, '.yarn')),
  ]);
}

function addYarnLock() {
  return writeFile(join(DIST_PATH, 'yarn.lock'), '');
}

function assemblePackage() {
  return createDirectory(DIST_PATH)
    .then(() => {
      return Promise.all([
        generatePackageJSON(),
        generateNPMIgnore(),
        copyEssentialFiles(),
      ]);
    });
}

assemblePackage()
  .catch((error) => {
    console.error(error);
  });


