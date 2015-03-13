const Counter = require('passthrough-counter')
const humanize = require('humanize-number')
const assert = require('assert')
const bytes = require('bytes')

module.exports = logger

// returns a new logger
// @param {Object} reporter
// @param {String} level
// @return {Function*}
function logger (reporter, level) {
  assert.equal(typeof reporter, 'function', 'reporter should be a bole instance')

  level = level || 'debug'
  const report = reporter('log')[level]

  // logger generator
  // @param {Function*} next
  return function * logger (next) {
    const start = new Date()
    const request = {
      message: '<--',
      method: this.method,
      uri: this.url
    }
    report(request)

    try {
      yield next
    } catch (err) {
      // log uncaught downstream errors
      const msg = log(this, start, null, err)
      report(msg)
      throw err
    }

    // calculate the length of a streaming response
    // by intercepting the stream with a counter.
    // only necessary if a content-length header is currently not set.
    var length = this.responseLength
    var body = this.body
    var counter
    if (length == null && body && body.readable) {
      this.body = body
        .pipe(counter = Counter())
        .on('error', this.onerror)
    }

    // log when the response is finished or closed,
    // whichever happens first.
    var ctx = this
    var res = this.res

    var onfinish = done.bind(null, 'finish')
    var onclose = done.bind(null, 'close')

    res.once('finish', onfinish)
    res.once('close', onclose)

    // handle a function end
    // @param {String} event
    function done (event) {
      res.removeListener('finish', onfinish)
      res.removeListener('close', onclose)
      const msg = log(ctx, start, counter ? counter.length : length, null, event)
      report(msg)
    }
  }
}

// log helper
// @param {Object} ctx
// @param {Date} start
// @param {Number?} len
// @param {Error?} err
// @param {String} event
function log (ctx, start, len, err, event) {
  // get the status code of the response
  var status = err
    ? (err.status || 500)
    : (ctx.status || 404)

  // get the human readable response length
  var length
  if (~[204, 205, 304].indexOf(status)) {
    length = ''
  } else if (len == null) {
    length = '-'
  } else {
    length = bytes(len)
  }

  const upstream = err
    ? 'xxx'
    : event === 'close'
    ? '-x-'
    : '-->'

  const printArgs = {
    message: upstream,
    method: ctx.method,
    uri: ctx.originalUrl,
    status: status,
    duration: time(start),
    length: length
  }

  return printArgs
}

// Show the response time in a human readable format.
// In milliseconds if less than 10 seconds,
// in seconds otherwise.
// @param {Date} start
// @return {String}
function time (start) {
  var delta = new Date() - start
  delta = delta < 10000
    ? delta + 'ms'
    : Math.round(delta / 1000) + 's'
  return humanize(delta)
}
