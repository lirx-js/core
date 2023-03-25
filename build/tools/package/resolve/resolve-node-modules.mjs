import { inspect } from 'node:util';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { minifyCss } from '../compile/minify-css.mjs';
import { minifyHtml } from '../compile/minify-html.mjs';
import { compileSass } from '../compile/compile-sass.mjs';
import { parse as acornParse } from 'acorn';
import { full as acornWalkFull } from 'acorn-walk';
import { generate as astringGenerate } from 'astring';
import { createDirectory, exploreDirectory } from '../../misc/fs-helpers.mjs';


const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT_PATH = join(__dirname, '../../../../');
const SRC_PATH = join(ROOT_PATH, 'src');
const DIST_PATH = join(ROOT_PATH, 'dist');
const MJS_CACHE_PATH = join(DIST_PATH, '.mjs-cache');
const CJS_CACHE_PATH = join(DIST_PATH, '.cjs-cache');

function logObject(obj) {
  console.log(inspect(obj, false, null, true /* enable colors */));
}

function setLiteralValue(
  node,
  value,
) {
  node.value = value;
  node.raw = JSON.stringify(value);
}

function isRelativeRequire(value) {
  // return importPath.startsWith('.')
  //   || $path.isAbsolute(importPath);
  return value.startsWith('./')
    || value.startsWith('../')
    || value.startsWith('/');

}

// https://nodejs.org/api/modules.html#modules_all_together

function isFile(path) {
  return stat(path)
    .then(
      (stats) => {
        return stats.isFile();
      },
      (error) => {
        if (error.code === 'ENOENT') {
          return false;
        } else {
          throw error;
        }
      },
    );
}

function isFileRelative(
  sourcePath,
  path,
) {
  return isFile(join(dirname(sourcePath), path));
}


function createRawFileESM(
  path,
  content,
) {
  return writeFile(path, `export default ${ JSON.stringify(content) };`);
}

function createRawFileCJS(
  path,
  content,
) {
  return writeFile(path, `module.exports = ${ JSON.stringify(content) };`);
}


function createRawFileModule(
  path,
  content,
  mode,
) {
  switch (mode) {
    case 'mjs':
      return createRawFileESM(path, content);
    case 'cjs':
      return createRawFileCJS(path, content);
    default:
      throw new Error(`Invalid module mode`);
  }
}


function createHashedRawFileModule(
  path,
  content,
  mode,
) {
  const id = createHash('sha256').update(content).digest('hex');
  const name = `${ id }.${ mode }`;
  const newPath = join(dirname(path), name);
  return createRawFileModule(newPath, content, mode)
    .then(() => newPath);
}

function findOriginalFilePath(
  path,
  mode,
) {
  const modePath = (() => {
    switch (mode) {
      case 'mjs':
        return 'src';
      case 'cjs':
        return 'cjs/src';
      default:
        throw new Error(`Invalid module mode`);
    }
  })();

  const relativeToDistPath = relative(join(resolve(DIST_PATH), modePath), resolve(path));

  return join(SRC_PATH, relativeToDistPath);
}

function isImportMetaURLNode(
  node,
) {
  return (node.type === 'MemberExpression')
    && (node.object.type === 'MetaProperty')
    && (node.object.meta.type === 'Identifier')
    && (node.object.meta.name === 'import')
    && (node.object.property.type === 'Identifier')
    && (node.object.property.name === 'meta')
    && (node.property.type === 'Identifier')
    && (node.property.name === 'url')
    ;
}

function isCJSImportMetaURLNode(
  node,
) {
  return (node.type === 'MemberExpression')
    && (node.object.type === 'Identifier')
    && (node.object.name === '__meta__')
    && (node.property.type === 'Identifier')
    && (node.property.name === 'url')
    ;
}

async function isSpecialRequireValue(
  sourcePath,
  path,
  mode,
) {
  const parentPath = dirname(sourcePath);
  const _path = join(parentPath, path);
  const url = new URL(_path, 'https://test.com');

  const pathname = url.pathname;
  const extension = extname(url.pathname);

  const raw = url.searchParams.has('raw');
  const inline = url.searchParams.has('inline');


  if (extension === '.html') {
    const srcPath = findOriginalFilePath(pathname, mode);
    const content = await minifyHtml(await readFile(srcPath, { encoding: 'utf8' }));
    const newPath = await createHashedRawFileModule(pathname, content, mode);
    console.log(`optimizing html: ${ srcPath }`);
    return './' + relative(parentPath, newPath);
  } else if (extension === '.css') {
    const srcPath = findOriginalFilePath(pathname, mode);
    const content = await minifyCss(await readFile(srcPath, { encoding: 'utf8' }), srcPath);
    const newPath = await createHashedRawFileModule(pathname, content, mode);
    console.log(`optimizing css: ${ srcPath }`);
    return './' + relative(parentPath, newPath);
  } else if (extension === '.scss') {
    const srcPath = findOriginalFilePath(pathname, mode);
    const content = await compileSass(srcPath);
    const newPath = await createHashedRawFileModule(pathname, content, mode);
    console.log(`optimizing scss: ${ srcPath }`);
    return './' + relative(parentPath, newPath);
  } else {
    return null;
  }
}

async function resolveRequireAsFile(
  sourcePath,
  value,
  mode,
) {
  let _value;
  if ((_value = await isSpecialRequireValue(sourcePath, value, mode)) !== null) {
    return _value;
  }
  if (await isFileRelative(sourcePath, value)) {
    return value;
  }
  const withJSExt = `${ value }.js`;
  if (await isFileRelative(sourcePath, withJSExt)) {
    return withJSExt;
  }
  const withMJSExt = `${ value }.mjs`;
  if (await isFileRelative(sourcePath, withMJSExt)) {
    return withMJSExt;
  }
  const withCJSExt = `${ value }.cjs`;
  if (await isFileRelative(sourcePath, withCJSExt)) {
    return withCJSExt;
  }
  const withJSONExt = `${ value }.json`;
  if (await isFileRelative(sourcePath, withJSONExt)) {
    return withJSONExt;
  }
  return null;
}

async function resolveRequireLoadIndex(
  sourcePath,
  value,
) {
  const withJSExt = `${ value }/index.js`;
  if (await isFileRelative(sourcePath, withJSExt)) {
    return withJSExt;
  }
  const withMJSExt = `${ value }/index.mjs`;
  if (await isFileRelative(sourcePath, withMJSExt)) {
    return withMJSExt;
  }
  const withCJSExt = `${ value }/index.cjs`;
  if (await isFileRelative(sourcePath, withCJSExt)) {
    return withCJSExt;
  }
  const withJSONExt = `${ value }/index.json`;
  if (await isFileRelative(sourcePath, withJSONExt)) {
    return withJSONExt;
  }
  return null;
}


async function resolveRequireAsDirectory(
  sourcePath,
  value,
) {
  const packageJSON = `${ value }/package.json`;
  if (await isFileRelative(sourcePath, packageJSON)) {
    throw new Error(`TODO: support package.json`);
  }

  const asIndex = await resolveRequireLoadIndex(sourcePath, value);
  if (asIndex !== null) {
    return asIndex;
  }

  return null;
}


async function resolveRelativeRequire(
  sourcePath,
  value,
  mode,
) {
  const asFile = await resolveRequireAsFile(sourcePath, value, mode);
  if (asFile !== null) {
    return asFile;
  }

  const asDirectory = await resolveRequireAsDirectory(sourcePath, value);
  if (asDirectory !== null) {
    return asDirectory;
  }

  // TODO LOAD_PACKAGE_IMPORTS
  // TODO LOAD_PACKAGE_IMPORTS
  // TODO LOAD_PACKAGE_SELF

  throw new Error(`Not found:  ${ value }`);
}


function resolveRequire(
  sourcePath,
  value,
  mode,
) {
  return isRelativeRequire(value)
    ? resolveRelativeRequire(sourcePath, value, mode)
    : Promise.resolve(value);
}

// alternative shortcut
/**
 * TODO
 * https://nodejs.org/api/esm.html
 *
 * - use nodejs resolution algorithm - MOSTLY implemented
 * - support data:... import
 * - support file:... import
 * - support caching to avoid rebuild everything everytime - EXPERIMENTAL
 */

async function resolveMJSFile(jsFilePath) {
  const cache = await loadMJSCache();

  if (cache.has(jsFilePath)) {
    const stats = await stat(jsFilePath);
    if (stats.mtimeMs < cache.get(jsFilePath)) { // already done
      // console.log('cached', jsFilePath);
      return;
    }
  }

  // if (!jsFilePath.includes('index')) {
  // if (!jsFilePath.includes('hello-world-named')) {
  // if (!jsFilePath.includes('hello-world-import')) {
  // if (!jsFilePath.includes('hello-world-import-all')) {
  // if (!jsFilePath.includes('mat-icons-search.component')) {
  //   return;
  // }

  let jsFileContent = await readFile(jsFilePath, { encoding: 'utf8' });

  const tree = acornParse(jsFileContent, {
    ecmaVersion: 'latest',
    sourceType: 'module',
  });
  // logObject(tree);

  const promises = [];

  acornWalkFull(tree, node => {

    const resolve = (node) => {
      const requireValue = node.value;
      promises.push(
        resolveRequire(jsFilePath, requireValue, 'mjs')
          .then((resolvedRequireValue) => {
            // console.log(jsFilePath, ':', requireValue, '->', resolvedRequireValue);
            setLiteralValue(node, resolvedRequireValue);
          }),
      );
    };

    // const resolveTemplateLiteral = (node) => {
    //   const last = node.quasis[node.quasis.length - 1].value;
    //   const lastPartValue = `${last.cooked}.mjs`;
    //   last.raw = lastPartValue;
    //   last.cooked = lastPartValue;
    // };

    // new URL('path', import.meta.url)
    const resolveURLImportMeta = (
      node,
    ) => {
      if (
        (node.type === 'NewExpression')
        && (node.callee.type === 'Identifier')
        && (node.callee.name === 'URL')
        && (node.arguments.length === 2)
        && isImportMetaURLNode(node.arguments[1])
      ) {
        const firstArg = node.arguments[0];

        if (
          (firstArg.type === 'Literal')
          && (typeof firstArg.value === 'string')
        ) {
          setLiteralValue(firstArg, `${ firstArg.value }.mjs`);
        } else if (firstArg.type === 'TemplateLiteral') {
          const last = firstArg.quasis[firstArg.quasis.length - 1].value;
          const lastPartValue = `${ last.cooked }.mjs`;
          last.raw = lastPartValue;
          last.cooked = lastPartValue;
        }
      }
    };

    const resolveURLWithImportMeta = (node) => {
      const last = node.quasis[node.quasis.length - 1].value;
      const lastPartValue = `${ last.cooked }.mjs`;
      last.raw = lastPartValue;
      last.cooked = lastPartValue;
    };

    switch (node.type) {
      case 'ImportExpression': {  // await import('./hello-world-lazy')
        if (node.source.type === 'Literal') { // only literal is currently supported
          resolve(node.source);
        }
        break;
      }
      case 'ImportDeclaration': {  // import { helloWorldNamed } from './hello-world-named'; or import * as helloWorld from './hello-world-named';
        if (node.source.type === 'Literal') {
          resolve(node.source);
        }
        break;
      }
      case 'ExportAllDeclaration': {  // export * from './src/index';
        resolve(node.source);
        break;
      }
      case 'ExportNamedDeclaration': {  // export { helloWorldNamed } from './hello-world-named';
        if (node.source && (node.source.type === 'Literal')) {
          resolve(node.source);
        }
        break;
      }
      default: {
        resolveURLImportMeta(node);
      }
    }
  });

  await Promise.all(promises);

  jsFileContent = astringGenerate(tree);

  await writeFile(jsFilePath, jsFileContent);

  cache.set(jsFilePath, Date.now());
}


async function resolveCJSFile(jsFilePath) {
  const cache = await loadCJSCache();

  if (cache.has(jsFilePath)) {
    const stats = await stat(jsFilePath);
    if (stats.mtimeMs < cache.get(jsFilePath)) { // already done
      // console.log('cached', jsFilePath);
      return;
    }
  }

  let jsFileContent = await readFile(jsFilePath, { encoding: 'utf8' });

  const tree = acornParse(jsFileContent, {
    ecmaVersion: 'latest',
    sourceType: 'script',
  });
  // logObject(tree);

  const promises = [];

  acornWalkFull(tree, node => {

    const resolve = (node) => {
      const requireValue = node.value;
      promises.push(
        resolveRequire(jsFilePath, requireValue, 'cjs')
          .then((resolvedRequireValue) => {
            // console.log(jsFilePath, ':', requireValue, '->', resolvedRequireValue);
            setLiteralValue(node, resolvedRequireValue);
          }),
      );
    };

    const resolveURLImportMeta = (
      node,
    ) => {
      if (
        (node.type === 'NewExpression')
        && (node.callee.type === 'Identifier')
        && (node.callee.name === 'URL')
        && (node.arguments.length === 2)
        && isCJSImportMetaURLNode(node.arguments[1])
      ) {
        const firstArg = node.arguments[0];

        if (
          (firstArg.type === 'Literal')
          && (typeof firstArg.value === 'string')
        ) {
          setLiteralValue(firstArg, `${ firstArg.value }.cjs`);
        } else if (firstArg.type === 'TemplateLiteral') {
          const last = firstArg.quasis[firstArg.quasis.length - 1].value;
          const lastPartValue = `${ last.cooked }.cjs`;
          last.raw = lastPartValue;
          last.cooked = lastPartValue;
        }
      }
    };

    switch (node.type) {
      case 'CallExpression': {  // require('./hello-world-lazy')
        if (
          (
            (node.callee.type === 'Identifier')
            && (node.callee.name === 'require')
          )
          &&
          (
            (node.arguments.length === 1)
            && (node.arguments[0].type === 'Literal')
          )
        ) { // only literal is currently supported
          resolve(node.arguments[0]);
        }
        break;
      }
      default: {
        resolveURLImportMeta(node);
      }
    }
  });

  await Promise.all(promises);

  jsFileContent = astringGenerate(tree);

  // console.log(jsFileContent);
  await writeFile(jsFilePath, jsFileContent);

  cache.set(jsFilePath, Date.now());
}

/* START - CACHE */

const CACHED_PROMISE_MAP = new Map();

function loadCache(
  cachedPromiseName,
  path,
) {
  let cachedPromise = CACHED_PROMISE_MAP.get(cachedPromiseName);
  if (cachedPromise === void 0) {
    cachedPromise = readFile(path, 'utf8')
      .then(
        (content) => {
          return new Map(JSON.parse(content));
        },
        () => {
          return new Map();
        },
      );

    CACHED_PROMISE_MAP.set(cachedPromiseName, cachedPromise);
  }
  return cachedPromise;
}

function saveCache(
  cachedPromiseName,
  path,
) {
  return (
    CACHED_PROMISE_MAP.has(cachedPromiseName)
      ? CACHED_PROMISE_MAP.get(cachedPromiseName)
      : Promise.resolve(new Map())
  )
    .then((cache) => {
      return writeFile(path, JSON.stringify(Array.from(cache.entries()), null, 2), 'utf8');
    });
}

// MJS

function loadMJSCache() {
  return loadCache(
    'mjs',
    MJS_CACHE_PATH,
  );
}

function saveMJSCache() {
  return saveCache(
    'mjs',
    MJS_CACHE_PATH,
  );
}

// CJS

function loadCJSCache() {
  return loadCache(
    'cjs',
    CJS_CACHE_PATH,
  );
}

function saveCJSCache() {
  return saveCache(
    'cjs',
    CJS_CACHE_PATH,
  );
}


/* END - CACHE */

function resolveNodeModules(
  modes,  // Set<'mjs' | 'cjs'>
) {
  return createDirectory(DIST_PATH)
    .then(() => {
      return exploreDirectory(DIST_PATH, (entryPath, entry) => {
        if (entry.isFile()) {
          if (entryPath.includes('/cjs/')) {
            if (entryPath.endsWith('.cjs')) {
              if (modes.has('cjs')) {
                return resolveCJSFile(entryPath);
              }
            }
          } else {
            if (entryPath.endsWith('.mjs')) {
              if (modes.has('mjs')) {
                return resolveMJSFile(entryPath);
              }
            }
          }
        }
      });
    })
    .then(() => {
      const cachePromises = [];
      if (modes.has('cjs')) {
        cachePromises.push(saveCJSCache());
      }
      if (modes.has('mjs')) {
        cachePromises.push(saveMJSCache());
      }
      return Promise.all(cachePromises);
    });
}

function getModes() {
  const modes = new Set();
  if (process.argv.includes('--cjs')) {
    modes.add('cjs');
  }
  if (process.argv.includes('--mjs')) {
    modes.add('mjs');
  }
  return modes;
}


// console.log(getModes());
resolveNodeModules(getModes())
  .catch((error) => {
    console.error(error);
  });


