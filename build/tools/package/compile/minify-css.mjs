import cssnano from 'cssnano';
import postcss from 'postcss';

// https://github.com/clean-css/clean-css
// https://github.com/postcss/postcss
// https://vitejs.dev/guide/features.html#postcss
// https://cssnano.co/docs/config-file/

export function minifyCss(
  code,
  from = '',
) {
  const cssnanoPlugin = cssnano({
    preset: 'default',
  });

  return postcss([
    cssnanoPlugin,
  ])
    .process(code, { from })
    .then((result) => {
      return result.css;
    });
}
