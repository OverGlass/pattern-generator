## Pattern Generator [![npm version](https://img.shields.io/npm/v/pattern-generator)](https://npmjs.org/package/pattern-generator)

Give one pattern, size and return a SVG string.
(Compatible NodeJS only for the moment)

Install

```bash
npm install pattern-generator

# -- OR --

yarn add pattern-generator
```

Import

```javascript
import patternGenerator from "pattern-generator";
```

Use

```javascript
patternGenerator("/path/to/img.png", 1600, 1000);
```

Options :

```javascript
patternGenerator("/path/to/img.png", 1600, 1000, {
  patternWidth: 500,
  patternOffset: { x: 0, y: 0 },
  backgroundColor: "#fff",
});
```
