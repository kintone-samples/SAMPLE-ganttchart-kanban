#! /usr/bin/env node
const { program } = require('commander')
const pkg = require('../../package.json')
const cert = require('../cert')
const server = require('../server')
const Watcher = require('../watch')

program.version(pkg.version, '-v, --version').description(pkg.description)
program
  .command('cert')
  .description('Generate development certificate')
  .option('-i, --install', 'Install CA certificate')
  .option('-u, --uninstall', 'Uninstall the CA certificate')
  .action((options) => {
    if (options.install) {
      cert.install()
    } else if (options.uninstall) cert.uninstall()
  })
program
  .command('serve <source>')
  .description('Start the static resource server')
  .option('-p, --port <port>', 'port', 443)
  .action((source, options) => {
    if (!options.port || !/^\d+$/.test(options.port)) throw new Error('Port number error')
    const option = { static: source, port: options.port }
    server.start(option)
  })
program
  .command('watch <source>')
  .description('Monitor the folder and automatically upload the file after it is found to be changed')
  .action(async (source) => {
    const watcher = new Watcher(source)
    await watcher.init()
    watcher.start()
  })
program.parse(process.argv)
