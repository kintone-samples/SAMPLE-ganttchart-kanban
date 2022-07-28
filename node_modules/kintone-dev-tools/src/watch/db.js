const fs = require('fs-extra')
const crypto = require('crypto')
const fg = require('fast-glob')

const getHash = (buffer) => {
  const hash = crypto.createHash('sha1')
  hash.update(buffer, 'utf8')
  return hash.digest('hex')
}

const hashSync = (file) => {
  const buffer = fs.readFileSync(file)
  return getHash(buffer)
}

const convert = async (file) => {
  const buffer = await fs.readFile(file)
  return [file, getHash(buffer)]
}

module.exports = class DB {
  constructor(dir) {
    this.dir = dir
  }

  async init() {
    const entries = (await fg(['**/*.js', '**/*.css'], { cwd: this.dir, dot: true, absolute: true })).map((file) =>
      convert(file),
    )
    this.db = new Map(await Promise.all(entries))
  }

  add(file) {
    if (this.db) this.db.set(file, hashSync(file))
  }

  change(file) {
    if (this.db) {
      const hash = hashSync(file)
      if (this.db.get(file) !== hash) {
        this.db.set(file, hash)
        return true
      }
    }
    return false
  }

  remove(file) {
    if (this.db) this.db.delete(file)
  }
}
