import { copyFile as _copyFile, mkdir, readdir } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';

// const $fs = require('fs/promises');
// const $path = require('path');

export function exploreDirectory(path, callback) {
  // return exploreDirectoryConcurrent(path, callback);
  return exploreDirectorySequential(path, callback);
}

function exploreDirectorySequential(path, callback) {
  return readdir(path, { withFileTypes: true })
    .then(async (entries) => {
      for (const entry of entries) {
        const subPath = join(path, entry.name);
        await new Promise(resolve => resolve(callback(subPath, entry)))
          .then(() => {
            if (entry.isDirectory()) {
              return exploreDirectorySequential(subPath, callback);
            }
          });
      }
    });
}

function exploreDirectoryConcurrent(path, callback) {
  return readdir(path, { withFileTypes: true })
    .then((entries) => {
      return Promise.all(
        entries.map((entry) => {
          const subPath = join(path, entry.name);
          return new Promise(resolve => resolve(callback(subPath, entry)))
            .then(() => {
              if (entry.isDirectory()) {
                return exploreDirectoryConcurrent(subPath, callback);
              }
            });
        }),
      );
    });
}

export function createDirectory(path) {
  return mkdir(path, { recursive: true })
    .catch((error) => {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    });
}

export function copyDirectory(source, destination, filter = () => true) {
  return exploreDirectory(source, (sourcePath, entry) => {
    if (entry.isFile()) {
      // console.log('\n');
      // console.log(sourcePath);
      // console.log($path.join(destination, $path.relative(source, sourcePath)));
      // console.log('\n');
      const destinationPath = join(destination, relative(source, sourcePath));

      if (filter(sourcePath, destinationPath, entry)) {
        return _copyFile(sourcePath, destinationPath);
      }
    }
  });
}

export function copyFile(source, destination) {
  return createDirectory(dirname(destination))
    .then(() => _copyFile(source, destination));
}

