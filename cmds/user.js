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
      await findUser(token)
      break
    default:
      console.error(`"${subCmd}" is not a valid command!`)
      break
  }
  console.log('args', ...args._)
}

const findUser = async token => {
  if (!token)
    return console.error(
      `${chalk.red('You are not authenticated. Please run')} ${chalk.yellow('ltv auth')} ${chalk.red('first.')}`
    )

  let user = await request.get({
    url: 'https://dealer.api.leisurevans.com/dealers',
    token: token,
  })

  return console.log(prettyjson.render(user))
}
