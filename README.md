# postcss-textures

[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

Use textures.js in CSS

## Install

```bash
yarn add -D postcss-textures
npm i -D postcss-textures
```

```js
postcss([textures])
```

## Usage

For example, if you want to use the following on this page

```js
textures.lines().heavier(10).thinner(1.5);
```

Write CSS like this.
(It resembles a function like `linear-gradient` of the CSS)

```css
.a {
  background: textures.lines(heavier 10, thinner 1.5)
}
```

The functions are as follows.

- `textures.lines`
- `textures.circles`
- `textures.paths`

## Related

### textures.js

> ### [riccardoscalco/textures](https://github.com/riccardoscalco/textures)
> [http://riccardoscalco.github.io/textures/](http://riccardoscalco.github.io/textures/)
>
>> MIT
>> Copyright (c) 2015 Riccardo Scalco
>> https://github.com/riccardoscalco/textures/blob/master/LICENSE.md#readme

## License

The MIT License (MIT)

Copyright (c) 2017 nju33 <nju33.ki@gmail.com>
