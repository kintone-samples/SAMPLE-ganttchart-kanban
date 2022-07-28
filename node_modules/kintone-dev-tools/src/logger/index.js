/* eslint-disable no-console */
const chalk = require('chalk')

const prefix = `${chalk.greenBright('[kdt]')}`

module.exports.error = (err) => {
  console.error(`${prefix}: ${chalk.redBright(err)}`)
}

module.exports.warn = (msg) => {
  console.error(`${prefix}: ${chalk.yellowBright(msg)}`)
}

module.exports.info = (msg) => {
  console.info(`${prefix}: ${chalk.greenBright(msg)}`)
}
