import fs from 'fs';
import postcss from 'postcss';
import textures from '..';

const css = fs.readFileSync(`${__dirname}/example.css`, 'utf-8');

postcss([textures])
  .process(css)
  .then(result => {
    fs.writeFileSync(`${__dirname}/index.css`, result.css);
    console.log(result);
  })
  .catch(err => {
    console.log(err);
  });
