const chokidar = require('chokidar')
const path = require('path')
const fs = require('fs-extra')
const Config = require('./config')
const DB = require('./db')
const { Client } = require('../kintone')
const logger = require('../logger')

module.exports = class Watcher {
  constructor(source) {
    this.source = source
    const dir = path.isAbsolute(source) ? source : path.resolve(process.cwd(), source)
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) throw new Error(`${dir} is not a directory`)
    this.config = new Config(dir)
    this.db = new DB(dir)
  }

  async init() {
    logger.info('initializing...')
    await this.config.load()
    this.client = new Client(this.config.env)
    await this.db.init()
  }

  start() {
    chokidar
      .watch(this.source, {
        ignored: (file) => {
          const fpath = path.isAbsolute(file) ? file : path.resolve(process.cwd(), file)
          const ext = path.extname(fpath)
          const flg = fs.existsSync(fpath) ? fs.lstatSync(fpath).isFile() : true
          const ignored = this.config.ignore.has(fpath) || (flg && ext !== '.js' && ext !== '.css')
          if (ignored) logger.warn(`The file '${file}' has been ignored`)
          return ignored
        },
        ignoreInitial: true,
      })
      .on('add', async (file) => {
        logger.info(`File '${file}' has been created`)
        const fpath = path.isAbsolute(file) ? file : path.resolve(process.cwd(), file)
        this.db.add(fpath)
        await this.upload(fpath, this.config.convert(fpath))
      })
      .on('change', async (file) => {
        const fpath = path.isAbsolute(file) ? file : path.resolve(process.cwd(), file)
        if (this.db.change(fpath)) {
          logger.info(`File '${file}' has been changed`)
          if (this.config.isConfig(fpath)) {
            logger.info('Reloading configuration...')
            await this.config.reload()
            this.client = new Client(this.config.env)
            return
          }
          await this.upload(fpath, this.config.convert(fpath))
        }
      })
      .on('unlink', async (file) => {
        logger.info(`File ${file} has been deleted`)
        const fpath = path.isAbsolute(file) ? file : path.resolve(process.cwd(), file)
        this.db.remove(fpath)
      })
    logger.info('File monitoring service has started')
  }

  async upload(file, options) {
    if (options) {
      logger.info(`Start uploading files to ${options.appid ? `App: ${options.appid}` : `portal`}`)
      await this.client.customizeFiles([file], options)
    } else {
      logger.warn('The corresponding upload address was not found')
    }
  }
}
