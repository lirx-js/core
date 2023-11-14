import { writeFile, readdir, readFile, rm } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { stderr, stdout } from 'node:process';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const ROOT_PATH = join(__dirname, '../../../');
const NODE_MODULES_PATH = join(ROOT_PATH, 'node_modules');
const YARN_LOCK_PATH = join(ROOT_PATH, 'yarn.lock');
const YARN_RC_PATH = join(ROOT_PATH, '.yarnrc.yml');
const PACKAGE_JSON_PATH = join(ROOT_PATH, 'package.json');

const npmRegistryServer = 'http://localhost:4873';

function runCommand(
  command,
  args,
  options,
) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, options);

    process.stdout.pipe(stdout);
    process.stderr.pipe(stderr);

    let errored = false;
    process.stderr.on('data', () => {
      errored = true;
    });

    process.on('close', () => {
      if (errored) {
        reject();
      } else {
        resolve();
      }
    });

    process.on('error', (error) => {
      reject(error);
    });
  });
}

function removeNodeModules() {
  return rm(NODE_MODULES_PATH, {
    force: true,
    recursive: true,
  });
}

function removeYarnLock() {
  return rm(YARN_LOCK_PATH, { force: true });
}


/* PACKAGE JSON */

function readPackageJson() {
  return readFile(PACKAGE_JSON_PATH, { encoding: 'utf8' })
    .then((content) => {
      return JSON.parse(content);
    });
}

function writePackageJson(json) {
  return writeFile(PACKAGE_JSON_PATH, JSON.stringify(json, null, 2));
}


function makeDevPackageJson(json) {
  const localDependencies = new Set(json.localDependencies ?? []);

  const updateDependencies = (dependencies) => {
    return Object.fromEntries(
      Object.entries(dependencies ?? {}).map(([name, version]) => {
        return [name, localDependencies.has(name) ? 'latest' : version];
      }),
    );
  };

  return {
    ...json,
    dependencies: updateDependencies(json.dependencies),
    devDependencies: updateDependencies(json.devDependencies),
    peerDependencies: updateDependencies(json.peerDependencies),
  };
}

/* YARN RC */

function readYarnRc() {
  return readFile(YARN_RC_PATH, { encoding: 'utf8' });
}

function makeDevYarnRc(content) {

  const reg = /npmRegistryServer\s*:\s(.*)(?:\n|$)/g;
  const match = reg.exec(content);

  const newNpmRegistryServerLine = `npmRegistryServer: ${JSON.stringify(npmRegistryServer)}` + '\n';

  if (match === null) {
    return content + '\n'
      + newNpmRegistryServerLine;
  } else {
    return content.slice(0, match.index)
      + newNpmRegistryServerLine
      + content.slice(match.index + match[0].length);
  }
}

function writeYarnRc(content) {
  return writeFile(YARN_RC_PATH, content);
}

/* YARN INSTALL */

function runYarnInstallCommand() {
  return runCommand('yarn', [], {
    cwd: ROOT_PATH,
  });
}

/* INSTALL */

async function installDev() {
  await removeNodeModules();
  await removeYarnLock();

  const [packageJson, yarnRc] = await Promise.all([
    readPackageJson(),
    readYarnRc(),
  ]);

  try {
    const devPackageJson = makeDevPackageJson(packageJson);
    const devYarnRc = makeDevYarnRc(yarnRc);

    await Promise.all([
      writePackageJson(devPackageJson),
      writeYarnRc(devYarnRc),
    ]);

    await runYarnInstallCommand();
  } finally {
    await Promise.all([
      writePackageJson(packageJson),
      writeYarnRc(yarnRc)
    ]);
  }
}

async function installProd() {
  await removeNodeModules();
  await removeYarnLock();

  await runYarnInstallCommand();

}

function install(dev) {
  if (dev) {
    return installDev();
  } else {
    return installProd();
  }
}


const dev = process.argv.includes('--dev');


install(dev)
  .catch((error) => {
    console.error(error);
  });
