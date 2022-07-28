const fs = require('fs-extra')
const constants = require('./constants')
const selfsigned = require('./selfsigned')
const current = require('./platforms').platform

module.exports.uninstall = () => {
  current.removeFromTrustStores(constants.rootCAPath)
  fs.removeSync(constants.pkgDir)
}

module.exports.install = () => {
  if (!constants.isMac && !constants.isLinux && !constants.isWindows)
    throw new Error(`Platform not supported: "${process.platform}"`)

  if (!fs.existsSync(constants.rootCAPath) && !fs.existsSync(constants.rootCAKeyPath)) {
    const ca = selfsigned.generateCA()
    fs.outputFileSync(constants.rootCAPath, ca.cert)
    fs.outputFileSync(constants.rootCAKeyPath, ca.private)
    current.addToTrustStores(constants.rootCAPath)
  }
}

module.exports.certificateFor = (requestedDomains = []) => {
  this.install()
  const arr = Array.isArray(requestedDomains) ? requestedDomains : [requestedDomains]
  const domains = arr.filter(selfsigned.filter)
  const ca = { cert: fs.readFileSync(constants.rootCAPath), private: fs.readFileSync(constants.rootCAKeyPath) }
  const cert = selfsigned.generateBy(ca, domains)
  return cert
}
