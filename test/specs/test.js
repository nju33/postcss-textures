import test from 'ava';
import postcss from 'postcss';
import textures from '../..';

test('textures.lines', async t => {
  const css = '.a{ background: textures.lines() }';
  const result = await postcss([textures]).process(css);
  t.regex(result.css, /data:image\/svg\+xml;base64,/);
});

test('textures.circles', async t => {
  const css = '.a{ background: textures.circles() }';
  const result = await postcss([textures]).process(css);
  t.regex(result.css, /data:image\/svg\+xml;base64,/);
});

test('textures.paths', async t => {
  const css = '.a{ background: textures.paths() }';
  const result = await postcss([textures]).process(css);
  t.regex(result.css, /data:image\/svg\+xml;base64,/);
});

test('textures.foo', async t => {
  const css = '.a{ background: textures.foo() }';
  const result = await postcss([textures]).process(css);
  t.notRegex(result.css, /data:image\/svg\+xml;base64,/);
});

test('Warning when undefined a function', async t => {
  const css = '.a{ background: textures.paths(foo) }';
  const result = await postcss([textures]).process(css);
  t.is(result.messages[0].text, 'foo is not a function');
});
