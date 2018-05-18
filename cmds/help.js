const chalk = require('chalk')
const figlet = require('figlet')
const ltv = chalk.green('ltv')
const command = chalk.yellow
const options = chalk.magenta
const heading = chalk.blue.bold

const menus = {
  main: `
    $ ${ltv} ${command('[command]')} ${options('<options>')}

    ${heading('USAGE')}
      $ ${ltv} ${command('auth')}                authenticate
      $ ${ltv} ${command('dealer')}              find dealers
      $ ${ltv} ${command('orders')}              find orders
      $ ${ltv} ${command('version')}             show package version
      $ ${ltv} ${command('help')}                show this help menu`,
  auth: `
    $ ${ltv} ${command('auth')}
    Authenticates your account on the LTV Dealer API.`,
  dealer: `
    $ ${ltv} ${chalk.green('dealer')} ${command('[command]')} ${options('[dealer]')}

    ${chalk.bold('Arguments')}

      --dealer, -d                    dealer ID

    ${chalk.bold('Examples')}

      $ ${ltv} ${chalk.green('dealer')} ${command('find')}              find all dealers
      $ ${ltv} ${chalk.green('dealer')} ${command('find')} -d 13201     show info for dealer 13201`,
  order: `
      $ ${ltv} ${chalk.green('order')} ${command('[command]')} ${options('[options]')}

      ${chalk.bold('Commands')}

        ${command('find')}              find an order
        ${command('invite')}            invite a user to MyLTV

      ${chalk.bold('Arguments')}

        --dealer, -d                    dealer ID ${chalk.red('(required)')}
        --name, -n                      customer name
        --coach, -c                     coach ID
        --vin, -V                       chassis VIN

      ${chalk.bold('Examples')}

        $ ${ltv} ${chalk.green('order')} ${command(
    'find'
  )} -d 13201                                     show orders for dealer 13201
        $ ${ltv} ${chalk.green('order')} ${command(
    'invite'
  )} -o 23524 -e joe@bob.com -n Joe Smith       invite Joe Smith to MyLTV`,
}

module.exports = args => {
  const subCmd = args._[0] === 'help' ? args._[1] : args._[0]

  const logo = chalk.green(figlet.textSync('LTV CLI', { horizontalLayout: 'full' }))

  console.info(logo + (menus[subCmd] || menus.main))
}
