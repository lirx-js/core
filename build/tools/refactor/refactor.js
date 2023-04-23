// import { readdir, readFile, rename, writeFile } from 'node:fs/promises';
// import * as $path from 'path';
// const ROOT_PATH = $path.join($path.dirname(new URL(import.meta.url).pathname), '..');

const $path = require('path');
const { readdir, readFile, rename, writeFile } = require('fs/promises');

const ROOT_PATH = $path.join(__dirname, '../../../');
// const NODE_MODULE_PATH = $path.join(ROOT_PATH, 'node_modules');
// const VITE_CACHE_PATH = $path.join(NODE_MODULE_PATH, '.vite');

const REFACTOR_DIRECTORY_PATH = $path.join(ROOT_PATH, 'src/core');

const SIMPLE_REFACTOR_FROM = 'abc';
const SIMPLE_REFACTOR_TO = 'def';


function dashCaseToCamelCase(
  input,
) {
  return input.replace(/-([a-z])/g, (_, firstLetter) => {
    return firstLetter.toUpperCase();
  });
}

function dashCaseToPascalCase(
  input,
) {
  const output = dashCaseToCamelCase(input);
  return `${output.slice(0, 1).toUpperCase()}${output.slice(1)}`;
}

function dashCaseToUpperCase(
  input,
) {
  return input
    .replace(/-/g, '_')
    .toUpperCase();
}

function createRefactorFunction(
  from,
  to,
) {
  if (!from.includes('-') && to.includes('-')) {
    throw new Error(`'from' must be dash-case`);
  }

  /* DASH CASE */
  const REPLACE_DASH_CASE_REGEXP = new RegExp(from, 'g');

  const replaceDashCase = (input) => {
    return input.replace(REPLACE_DASH_CASE_REGEXP, to);
  };

  /* CAMEL CASE */
  const fromAsCamelCase = dashCaseToCamelCase(from);
  const toAsCamelCase = dashCaseToCamelCase(to);
  const REPLACE_CAMEL_CASE_REGEXP = new RegExp(fromAsCamelCase, 'g');

  const replaceCamelCase = (input) => {
    return input.replace(REPLACE_CAMEL_CASE_REGEXP, toAsCamelCase);
  };

  const replaceDashAndCamelCase = from.includes('-')
    ? (input) => {
      return replaceCamelCase(replaceDashCase(input));
    }
    : replaceDashCase

  /* PASCAL CASE */
  const fromAsPascalCase = dashCaseToPascalCase(from);
  const toAsPascalCase = dashCaseToPascalCase(to);
  const REPLACE_PASCAL_CASE_REGEXP = new RegExp(fromAsPascalCase, 'g');

  const replacePascalCase = (input) => {
    return input.replace(REPLACE_PASCAL_CASE_REGEXP, toAsPascalCase);
  };


  /* UPPER CASE */

  const fromAsUpperCase = dashCaseToUpperCase(from);
  const toAsUpperCase = dashCaseToUpperCase(to);
  const REPLACE_UPPER_CASE_REGEXP = new RegExp(fromAsUpperCase, 'g');

  const replaceUpperCase = (input) => {
    return input.replace(REPLACE_UPPER_CASE_REGEXP, toAsUpperCase);
  };

  /* JOIN */

  return (input) => {
    return replaceUpperCase(replacePascalCase(replaceDashAndCamelCase(input)));
  };
}


const REFACTOR_FILE_NAME = createRefactorFunction(SIMPLE_REFACTOR_FROM, SIMPLE_REFACTOR_TO);

const REFACTOR_FILE_CONTENT = createRefactorFunction(SIMPLE_REFACTOR_FROM, SIMPLE_REFACTOR_TO);

// const REFACTOR_FILE_NAME = (input) => {
//   return input.replace(new RegExp(SIMPLE_REFACTOR_FROM, 'g'), SIMPLE_REFACTOR_TO);
// };
//
// const REFACTOR_FILE_CONTENT = (input) => {
//   return input.replace(new RegExp(SIMPLE_REFACTOR_FROM, 'gi'), (substring) => {
//     if (substring.at(0).toUpperCase() === substring.at(0)) {
//       return SIMPLE_REFACTOR_TO.slice(0, 1).toUpperCase()
//         + SIMPLE_REFACTOR_TO.slice(1);
//     } else {
//       return SIMPLE_REFACTOR_TO;
//     }
//   });
// };

// const REFACTOR_FILE_NAME = (input) => {
//   return input.replace(/retain/g, 'payload');
// };
//
// const REFACTOR_FILE_CONTENT = (input) => {
//   return input.replace(/retain/gi, (substring) => {
//     if (substring.at(0).toUpperCase() === substring.at(0)) {
//       return 'Payload';
//     } else {
//       return 'payload';
//     }
//   });
// };


function exploreDirectory(path, callback) {
  // return exploreDirectoryConcurrent(path, callback);
  return exploreDirectorySequential(path, callback);
}

function exploreDirectorySequential(path, callback) {
  return readdir(path, { withFileTypes: true })
    .then(async (entries) => {
      for (const entry of entries) {
        const subPath = $path.join(path, entry.name);
        await new Promise(resolve => resolve(callback(subPath, entry)))
          .then(() => {
            if (entry.isDirectory()) {
              return exploreDirectorySequential(subPath, callback);
            }
          });
      }
    });
}


function refactorFileName(
  entryPath,
) {
  const newPath = $path.join($path.dirname(entryPath), REFACTOR_FILE_NAME($path.basename(entryPath)));
  if (entryPath === newPath) {
    return Promise.resolve();
  } else {
    if (dry) {
      console.log(`rename: '${$path.basename(entryPath)}' => '${$path.basename(newPath)}'`);
      return Promise.resolve();
    } else {
      return rename(entryPath, newPath);
    }
  }
}

function refactorFileContent(
  entryPath,
  dry,
) {
  return readFile(entryPath, { encoding: 'utf8' })
    .then((content) => {
      const newContent = REFACTOR_FILE_CONTENT(content);
      if (newContent !== content) {
        if (dry) {
          console.log(`in: '${$path.basename(entryPath)}'`);
          console.log(newContent);
        } else {
          return writeFile(entryPath, newContent, { encoding: 'utf8' });
        }
      }
    });
}

async function run(
  dry,
) {
  exploreDirectory(REFACTOR_DIRECTORY_PATH, (entryPath, entry) => {
    if (entry.isFile()) {
      return refactorFileContent(entryPath, dry)
        .then(() => {
          return refactorFileName(entryPath, dry);
        });
    }/* else if (entry.isDirectory()) {
      return refactorFileName(entryPath);
    }*/
  });
}

const dry = false;

run(dry);


