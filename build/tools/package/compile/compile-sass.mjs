// import { compile } from 'sass';
import sass from 'sass';
import { minifyCss } from './minify-css.mjs';

const { compile } = sass;


export function compileSass(
  path,
) {
  return minifyCss(compile(path).css, path);
}
