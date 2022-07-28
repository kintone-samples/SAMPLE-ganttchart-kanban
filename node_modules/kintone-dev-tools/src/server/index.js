const https = require('https')
const express = require('express')
const serveIndex = require('serve-index')
const ip = require('ip')
const { certificateFor } = require('../cert')
const logger = require('../logger')

module.exports.start = (option) => {
  logger.info('Configuring developer certificate...')
  const myip = ip.address()
  const cert = certificateFor(myip)
  const app = express()
  app.use('/', express.static(option.static), serveIndex(option.static, { icons: true }))
  const httpsServer = https.createServer(
    {
      key: cert.private,
      cert: cert.cert,
    },
    app,
  )
  httpsServer.listen(option.port ? option.port : 443)
  logger.info('The server has been started, you can access it through the following link:')
  const port = !option.port || option.port === 443 ? '' : `:${option.port}`
  logger.info(`Local -> https://localhost${port}/`)
  logger.info(`Network -> https://${myip}${port}/`)
}
