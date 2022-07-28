const axios = require('axios')
const FormData = require('form-data')
const path = require('path')
const fs = require('fs-extra')
const logger = require('../logger')

const handleError = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    throw new Error(error.response.data.message)
  }
  throw error
}

const getFileKeys = (template, key) => {
  if (!template.has(key)) template.set(key, { jsType: key, fileKeys: [] })
  return template.get(key).fileKeys
}

const host = (str) => {
  if (/https?:\/\//gi.test(str)) {
    return new URL(str).host
  }
  return str
}

module.exports = class Client {
  constructor(env) {
    this.instance = axios.create({
      baseURL: `https://${host(env.baseurl)}`,
      timeout: 10000,
      headers: {
        'X-Cybozu-Authorization': Buffer.from(`${env.username}:${env.password}`).toString('base64'),
      },
    })
  }

  async uploadPlugin(name, buff) {
    const fd = new FormData()
    fd.append('file', buff, name)
    const config = {
      headers: {
        'Content-Type': fd.getHeaders()['content-type'],
      },
    }
    try {
      const response = await this.instance.post('/k/api/blob/upload.json', fd, config)
      const result = await this.instance.post('/k/api/dev/plugin/import.json', {
        item: response.data.result.fileKey,
      })
      if (result.data.success) logger.info(`${name} has been uploaded!`)
    } catch (err) {
      handleError(err)
    }
  }

  async upload(files, types) {
    let list = []
    types.forEach((type) => {
      const key = type.toUpperCase()
      list = list.concat(
        files.map((file) => {
          return {
            path: file,
            name: path.basename(file),
            type: path.extname(file).slice(1) === 'js' ? key : `${key}_CSS`,
          }
        }),
      )
    })

    const responses = await Promise.all(
      list.map((file) => {
        const fd = new FormData()
        fd.append('file', fs.readFileSync(file.path), file.name)
        const config = {
          headers: {
            'Content-Type': fd.getHeaders()['content-type'],
          },
        }
        return this.instance.post('/k/v1/file.json', fd, config)
      }),
    )
    return responses.map((response, index) => {
      return {
        type: list[index].type,
        name: list[index].name,
        contentId: response.data.fileKey,
      }
    })
  }

  async customizeLinks(urls, options = {}) {
    if (urls.length === 0) {
      logger.warn('URL not found')
      return
    }
    const opt = options
    opt.upload = opt.upload || ['desktop', 'mobile']
    try {
      const arr = urls.map((url) => {
        const types = Array.isArray(opt.upload) ? opt.upload : [opt.upload]
        return { types: new Set(types.map((el) => el.toUpperCase())), contentUrl: url }
      })
      const cb = (scripts) => {
        const template = new Map()
        scripts.forEach((file) => {
          const fileKeys = getFileKeys(template, file.type)
          if (file.locationType === 'URL') {
            const index = arr.findIndex((el) => el.contentUrl === file.contentUrl)
            if (index !== -1) {
              arr[index].types.delete(file.type)
              if (arr[index].types.size === 0) arr.splice(index, 1)
            }
          }
          fileKeys.push(file.locationType === 'URL' ? file.contentUrl : file.contentId)
        })
        if (arr.length === 0) return undefined
        arr.forEach((url) => url.types.forEach((value) => getFileKeys(template, value).push(url.contentUrl)))
        return Array.from(template.values())
      }
      await this.customize(cb, opt.appid)
    } catch (err) {
      handleError(err)
    }
  }

  async customizeFiles(files, options = {}) {
    if (files.length === 0) {
      logger.warn('File not found')
      return
    }
    const opt = options
    opt.upload = opt.upload || ['desktop', 'mobile']
    try {
      const arr = await this.upload(files, Array.isArray(opt.upload) ? opt.upload : [opt.upload])
      const cb = (scripts) => {
        const template = new Map()
        scripts.forEach((file) => {
          let contentId
          const fileKeys = getFileKeys(template, file.type)
          if (file.locationType === 'BLOB') {
            const index = arr.findIndex((el) => el.name === file.name && el.type === file.type)
            if (index !== -1) {
              contentId = arr[index].contentId
              arr.splice(index, 1)
            }
          }
          fileKeys.push(file.locationType === 'BLOB' ? contentId || file.contentId : file.contentUrl)
        })
        arr.forEach((file) => getFileKeys(template, file.type).push(file.contentId))
        return Array.from(template.values())
      }
      await this.customize(cb, opt.appid)
    } catch (err) {
      handleError(err)
    }
  }

  async customize(callback, appid) {
    const settings = appid
      ? await this.instance.post('/k/api/js/get.json', { app: appid })
      : await this.instance.post('/k/api/js/getSystemSetting.json', {})
    const jsFiles = callback(settings.data.result.scripts)
    if (jsFiles) {
      const body = {
        jsScope: settings.data.result.scope,
        jsFiles,
      }
      if (appid) {
        const app = await this.instance.get(`/k/v1/app.json?id=${appid}`)
        body.id = appid
        body.name = app.data.name
        await this.instance.post('/k/api/dev/app/update.json', body)
      }
      const result = appid
        ? await this.instance.post('/k/api/dev/app/deploy.json', {
            app: appid,
          })
        : await this.instance.post('/k/api/js/updateSystemSetting.json', body)

      if (result.data.success) return logger.info('The configuration has been updated')
    }
    return logger.info('No need to update!')
  }
}
