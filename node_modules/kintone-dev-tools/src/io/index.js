const fs = require('fs-extra')
const path = require('path')

module.exports.emptyDirSync = (dir) => {
  fs.emptyDirSync(dir)
}

module.exports.copySync = (source, target) => {
  fs.copySync(source, target)
}

module.exports.outputSync = (dir, name, datas, options = {}) => {
  const opts = options
  opts.clean = Object.prototype.hasOwnProperty.call(opts, 'clean') ? opts.clean : false
  if (opts.clean) fs.emptyDirSync(dir)
  fs.outputFileSync(path.resolve(dir, name), datas)
}
