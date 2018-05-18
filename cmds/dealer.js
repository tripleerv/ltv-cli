const ora = require('ora')
const chalk = require('chalk')
const request = require('../utils/request')
const conf = require('../lib/config')
const prettyjson = require('prettyjson')

module.exports = async args => {
  const token = conf.get('auth.token')
  const subCmd = args._[1]
  switch (subCmd) {
    case 'create':
      break
    case 'find':
      await findDealer(args, token)
      break
    default:
      console.error(`"${subCmd}" is not a valid command!`)
      break
  }
}

const findDealer = async (args, token) => {
  if (!token)
    return console.error(
      `${chalk.red('You are not authenticated. Please run')} ${chalk.yellow('ltv auth')} ${chalk.red('first.')}`
    )

  const spinner = ora().start('Fetching dealers...')

  if (args.d || args.dealer) {
    let dealerId = args.d || args.dealer
    let dealer = await request.get({
      url: `https://dealer.api.leisurevans.com/dealers/${dealerId}`,
      token: token,
    })
    spinner.stop()
    return console.log(prettyjson.render(dealer))
  } else {
    let dealers = await request.get({
      url: `https://dealer.api.leisurevans.com/dealers`,
      token: token,
    })
    spinner.stop()
    return console.log(prettyjson.render(dealers))
  }
}
