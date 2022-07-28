const packFromManifest = require('@kintone/plugin-packer/from-manifest')
const fs = require('fs-extra')
const Rsa = require('node-rsa')
const path = require('path')
const { parse } = require('./mainfest')

module.exports.gen = (ppk) => {
  if (!fs.existsSync(ppk)) {
    const key = new Rsa({ b: 1024 })
    const privateKey = key.exportKey('pkcs1-private')
    fs.outputFileSync(ppk, privateKey)
    return privateKey
  }
  return fs.readFileSync(ppk)
}

module.exports.pack = async (maifest, ppk) => {
  if (!fs.existsSync(maifest)) {
    throw new Error('Not find mainfest!')
  }
  const result = await packFromManifest(maifest, this.gen(ppk))
  if (!result.plugin) {
    throw new Error('Creare Plugin fail!')
  }
  return result.plugin
}

module.exports.saveAsSync = (source, target, modify) => {
  const manifest = parse(fs.readFileSync(source), modify)
  fs.writeFileSync(target, JSON.stringify(manifest, null, 2))
  return manifest
}

module.exports.copyNecessarySync = (source, target, manifest) => {
  const json = manifest || fs.readJSONSync(source)
  const sourceDir = path.dirname(source)
  if (json.config && json.config.html) {
    fs.copySync(path.resolve(sourceDir, json.config.html), path.resolve(target, json.config.html))
  }
  fs.copySync(path.resolve(sourceDir, json.icon), path.resolve(target, json.icon))
}
