const applicationConfigPath = require('application-config-path')
const path = require('path')
const pkg = require('../../package.json')

const ca = 'root.crt'
const caKey = 'root.key'

module.exports.isMac = process.platform === 'darwin'
module.exports.isLinux = process.platform === 'linux'
module.exports.isWindows = process.platform === 'win32'
module.exports.pkgName = pkg.name

module.exports.pkgDir = applicationConfigPath(this.pkgName)
module.exports.rootCAPath = path.resolve(this.pkgDir, ca)
module.exports.VALID_IP = /(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}/
module.exports.VALID_DOMAIN = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.?)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i

module.exports.rootCAPath = path.resolve(this.pkgDir, ca)
module.exports.rootCAKeyPath = path.resolve(this.pkgDir, caKey)
