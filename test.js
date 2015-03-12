const logger = require('./')
const bole = require('bole')
const koa = require('koa')

bole.output({
  level: 'debug',
  stream: process.stdout
})

const server = koa()
server.use(logger(bole))
server.listen(1337)
