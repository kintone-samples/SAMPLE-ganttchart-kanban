const spawn = require('cross-spawn')
const constants = require('../constants')

const targetCA = `/usr/local/share/ca-certificates/${constants.pkgNam}.crt`

module.exports.addToTrustStores = (certPath) => {
  spawn.sync('sudo', ['cp', certPath, targetCA])
  spawn.sync('sudo', ['update-ca-certificates'])
}

module.exports.removeFromTrustStores = () => {
  spawn.sync('sudo', ['rm', targetCA], { stdio: 'inherit' })
  spawn.sync('sudo', ['update-ca-certificates'])
}
