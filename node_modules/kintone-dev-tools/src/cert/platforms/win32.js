const spawn = require('cross-spawn')
const constants = require('../constants')

module.exports.addToTrustStores = (certPath) => {
  spawn.sync('certutil', ['-addstore', '-user', 'root', certPath], { stdio: 'inherit' })
}

module.exports.removeFromTrustStores = () => {
  spawn.sync('certutil', ['-delstore', '-user', 'root', constants.pkgName], { stdio: 'inherit' })
}
