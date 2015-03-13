# koa-logger-ndjson
[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Downloads][downloads-image]][downloads-url]
[![js-standard-style][standard-image]][standard-url]

Universal logging middleware for [koa](https://github.com/koajs/koa). Plays
well with [bole](https://github.com/rvagg/bole) or any other logger that
exposes a `.debug()` function.

## Installation
```bash
$ npm install koa-logger-ndjson
```

## Usage
```js
const logger = require('koa-logger-ndjson')
const bole = require('bole')
const koa = require('koa')

const server = koa()

// configure `bole`
bole.output({
  level: 'debug',
  stream: process.stdout
})

// pass `bole` to `logger`
server.use(logger(bole, 'debug'))
server.listen(1337)
```
```
$ node server.js
{"time":"2015-03-13T01:14:38.585Z","hostname":"Yoshuas-MacBook-Pro.local","pid":84297,"level":"debug","name":"log","message":"<--","method":"GET","uri":"/"}
{"time":"2015-03-13T01:14:38.596Z","hostname":"Yoshuas-MacBook-Pro.local","pid":84297,"level":"debug","name":"log","message":"-->","method":"GET","uri":"/","status":404,"duration":"10ms","length":"-"}
```
```
$ node server.js | ndjson-logrus
DBUG[0152] [log] <-- method="GET" uri="/"
DBUG[0152] [log] --> method="GET" uri="/" status=404 duration="10ms" length="-"
DBUG[0172] [log] <-- method="GET" uri="/"
DBUG[0172] [log] --> method="GET" uri="/" status=404 duration="3ms" length="-"
DBUG[0182] [log] <-- method="GET" uri="/"
DBUG[0182] [log] --> method="GET" uri="/" status=404 duration="0ms" length="-"
DBUG[0202] [log] <-- method="GET" uri="/"
DBUG[0202] [log] --> method="GET" uri="/" status=404 duration="1ms" length="-"
```

## See Also
- [bole](https://github.com/rvagg/bole) - modular logger
- [ndjson-logrus](https://github.com/yoshuawuyts/ndjson-logrus) - beautify ndjson
- [koa-logger](https://github.com/koajs/koa-logger) - koa logging middleware
    from which this module was adapted

## License
[MIT](https://tldrlegal.com/license/mit-license)

[npm-image]: https://img.shields.io/npm/v/koa-logger-ndjson.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-logger-ndjson
[travis-image]: https://img.shields.io/travis/yoshuawuyts/koa-logger-ndjson.svg?style=flat-square
[travis-url]: https://travis-ci.org/yoshuawuyts/koa-logger-ndjson
[downloads-image]: http://img.shields.io/npm/dm/koa-logger-ndjson.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/koa-logger-ndjson
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
