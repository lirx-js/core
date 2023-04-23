import { rename } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { exploreDirectory } from '../misc/fs-helpers.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT_PATH = join(__dirname, '../../../');
const SRC_PATH = join(ROOT_PATH, 'src');

async function commentIndexFile(indexFilePath) {
  const newFilePath = `${ indexFilePath }.txt`;
  await rename(indexFilePath, newFilePath);
}

async function uncommentIndexFile(indexFilePath) {
  const newFilePath = indexFilePath.slice(0, -4);
  await rename(indexFilePath, newFilePath);
}


function commentIndexFiles() {
  return exploreDirectory(SRC_PATH, (entryPath, entry) => {
    if (entry.isFile()) {
      if (entryPath.endsWith('index.ts')) {
        return commentIndexFile(entryPath);
      }
    }
  });
}

function uncommentIndexFiles() {
  return exploreDirectory(SRC_PATH, (entryPath, entry) => {
    if (entry.isFile()) {
      if (entryPath.endsWith('index.ts.txt')) {
        // console.log(entryPath);
        return uncommentIndexFile(entryPath);
      }
    }
  });
}

const uncomment = process.argv.includes('--uncomment');

(uncomment ? uncommentIndexFiles() : commentIndexFiles())
  .catch((error) => {
    console.error(error);
  });
