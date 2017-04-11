import postcss from 'postcss';
import * as d3 from 'd3';
import textures from 'textures';
import cheerio from 'cheerio';
import pify from 'pify';
import jsdom from 'jsdom';

export default postcss.plugin('postcss-textures', () => {
  const re = /^textures\.(circles|lines|paths)\((.*)\)/;
  return async (root, result) => {
    const win = await pify(jsdom.env)('', {QuerySelector: true});
    win.d3 = d3.select(win.document);

    root.replaceValues(re, (match, key, $args) => {
      const svgElement = win.d3.select('body').append('svg');
      const args = parseArgs($args);
      const svgCreater = args.reduce((creater, arg) => {
        if (arg.args === null) {
          try {
            return creater[arg.key]();
          } catch (err) {
            result.warn(`${arg.key} is not a function`);
            return creater;
          }
        }
        try {
          return creater[arg.key].apply(creater[arg.key], arg.args);
        } catch (err) {
          result.warn(`${arg.key} is not a function`);
          return creater;
        }
      }, textures[key]());
      try {
        svgElement.call(svgCreater);
      } catch (err) {
        // (node:31398)
        //   UnhandledPromiseRejectionWarning:
        //     Unhandled promise rejection (rejection id: 1):
        //       TypeError: _ is not a function
        // (node:31398)
        //   DeprecationWarning:
        //     Unhandled promise rejections are deprecated.
        //     In the future, promise rejections that are not handled will
        //     terminate the Node.js process with a non-zero exit code.
      }
      const svg = (html => {
        const $ = cheerio.load(html);
        const $pattern = $('pattern');
        const svgContents = $pattern.html();
        const width = $pattern.attr('width');
        const height = $pattern.attr('height');
        const formated = format({width, height, svgContents});
        svgElement.remove();
        return formated;
      })(svgElement.html());
      const base64 = [
        'data:image/svg+xml;base64,',
        Buffer.from(svg).toString('base64')
      ].join('');

      return `url(${base64})`;
    });
  };
});

function parseArgs($args) {
  if ($args === '') {
    return [];
  }
  const arr = $args.split(/\s*,\s*/);
  return arr.map(item => {
    const itemArr = item.split(/\s+/);
    const result = {};
    if (typeof itemArr[0] !== 'undefined') {
      result.key = itemArr[0];
      itemArr.shift();
    }
    if (itemArr.length > 0) {
      result.args = itemArr;
    } else {
      result.args = null;
    }
    return result;
  });
}

function format({width, height, svgContents}) {
  return [
    '<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"',
    ' "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
    `<svg width="${width}px" height="${height}px"`,
    ` viewBox="0 0 ${width} ${height}"`,
    ' xmlns="http://www.w3.org/2000/svg">',
    svgContents,
    '</svg>'
  ].join('');
}
