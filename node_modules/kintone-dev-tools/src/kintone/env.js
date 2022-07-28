const inquirer = require('inquirer')
const fs = require('fs-extra')
const path = require('path')
const logger = require('../logger')

const validate = (err, msg) => {
  if (err) {
    logger.warn(` ${msg}`)
    return false
  }
  return true
}

const notEmpty = (input) => {
  return validate(!input || input.length === 0, 'Can not be empty')
}

module.exports = class Env {
  constructor(file) {
    this.file = file
  }

  async load(options = {}) {
    const opts = options
    opts.expends = opts.expends || []
    opts.expends = Array.isArray(opts.expends) ? opts.expends : [opts.expends]
    opts.save = Object.prototype.hasOwnProperty.call(opts, 'save') ? opts.save : true

    const configuration = fs.existsSync(this.file) ? require(this.file) : { env: {} }
    const questions = [
      {
        type: 'input',
        message: 'Please enter base url',
        name: 'baseurl',
        validate: notEmpty,
      },
      {
        type: 'input',
        message: 'Please enter user name',
        name: 'username',
        validate: notEmpty,
      },
      {
        type: 'password',
        message: 'Please enter password',
        name: 'password',
        validate: notEmpty,
      },
    ].concat(opts.expends)

    for (let i = questions.length - 1; i >= 0; i -= 1) {
      if (configuration.env[questions[i].name]) questions.splice(i, 1)
    }
    if (questions.length > 0) {
      const answers = await inquirer.prompt(questions)
      Object.assign(configuration.env, answers)
      if (opts.save) this.save(configuration)
    }
    return configuration
  }

  save(configuration) {
    const template =
      path.extname(this.file).toLocaleLowerCase() === '.json'
        ? JSON.stringify(configuration, null, 2)
        : `module.exports = ${JSON.stringify(configuration, null, 2)}`
    fs.outputFileSync(this.file, template)
  }
}
