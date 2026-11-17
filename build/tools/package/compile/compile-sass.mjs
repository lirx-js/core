import { compile } from 'sass';
import { minifyCss } from './minify-css.mjs';

export function compileSass(
  path,
) {
  return minifyCss(compile(path).css, path);
}
