const spawn = require('cross-spawn')

module.exports.addToTrustStores = (certPath) => {
  spawn.sync(
    'sudo',
    [
      'security',
      'add-trusted-cert',
      '-d',
      '-r',
      'trustRoot',
      '-k',
      '/Library/Keychains/System.keychain',
      '-p',
      'ssl',
      '-p',
      'basic',
      certPath,
    ],
    { stdio: 'inherit' },
  )
}

module.exports.removeFromTrustStores = (certPath) => {
  if (certPath) {
    spawn.sync('sudo', ['security', 'remove-trusted-cert', '-d', certPath], { stdio: 'ignore' })
  }
}
