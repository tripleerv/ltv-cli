const ora = require('ora')
const chalk = require('chalk')
const inquirer = require('inquirer')
const request = require('../utils/request')
const conf = require('../lib/config')
const prettyjson = require('prettyjson')

module.exports = async args => {
  const token = conf.get('auth.token')
  const subCmd = args._[1]
  switch (subCmd) {
    case 'find':
      await findOrder(args, token)
      break
    case 'invite':
      await inviteUser(args, token)
      break
    default:
      console.error(`"${subCmd}" is not a valid command!`)
      break
  }
}

const findOrder = async (args, token) => {
  if (!token)
    return console.error(
      `${chalk.red('You are not authenticated. Please run')} ${chalk.yellow('ltv auth')} ${chalk.red('first.')}`
    )

  let dealerId = args.d || args.dealer
  let customerName = args.n || args.name
  let vin = args.V || args.vin
  let coach = args.c || args.coach
  let order = args.o || args.order

  let searchValues = [
    {
      type: 'name',
      value: customerName,
      weight: 30,
    },
    {
      type: 'vin',
      value: vin,
      weight: 70,
    },
    {
      type: 'coach',
      value: coach,
      weight: 50,
    },
    {
      type: 'order',
      value: order,
      weight: 100,
    },
  ]

  let sortedSearch = await getSearchParams(searchValues)

  if (!dealerId) {
    const dealer = await getDealerSelection()
    dealerId = dealer.dealer
  }

  const spinner = ora().start('Fetching orders...')

  if (dealerId && customerName) {
    let orders = await request.get({
      url: `https://dealer.api.leisurevans.com/orders`,
      token: token,
      query: {
        type: sortedSearch[0].type,
        value: sortedSearch[0].value,
        dealerId: dealerId,
      },
    })
    spinner.stop()
    return console.log(prettyjson.render(orders))
  } else if (order || vin || coach) {
    let order = await request.get({
      url: `https://dealer.api.leisurevans.com/orders`,
      token: token,
      query: {
        type: sortedSearch[0].type,
        value: sortedSearch[0].value,
      },
    })
    spinner.stop()
    return console.log(prettyjson.render(order))
    // } else if (customerName) {
    //   let orders = await request.get({
    //     url: `https://dealer.api.leisurevans.com/orders`,
    //     token: token,
    //     query: {
    //
    //     }
    //     }
    //   })
  } else if (!dealerId) {
    spinner.stop()
    return console.log(chalk.red('No dealer ID was provided. Please provide one using -d or --dealer.'))
  } else {
    spinner.stop()
    return console.log(chalk.red('No search parameters were provided. For help, type ltv help order'))
  }
}

const getSearchParams = async vals => {
  let sorted = vals.sort((a, b) => a.weight - b.weight).reverse()

  let sortedSearch = sorted.filter(el => {
    return el.value !== undefined
  })
  return sortedSearch
}

const inviteUser = async (args, token) => {
  if (!token)
    return console.error(
      `${chalk.red('You are not authenticated. Please run')} ${chalk.yellow('ltv auth')} ${chalk.red('first.')}`
    )

  const spinner = ora().start('Reticulating splines...')
  if ((args.o || args.order) && (args.e || args.email)) {
    let orderId = args.o || args.order
    let email = args.e || args.email
    let name = args.n || args.name
    let order = await request.get({
      url: `https://dealer.api.leisurevans.com/orders`,
      token: token,
      query: {
        type: 'order',
        value: orderId,
      },
    })
    let invite = await request.post({
      url: `https://dealer.api.leisurevans.com/orders/invite/myltv`,
      method: 'POST',
      token: token,
      body: {
        email: email,
        model: order.product,
        name: name,
        guid: order.order.unitGuid,
        orderId: order.order.orderID,
        dealerId: order.order.dealerID,
      },
    })
    spinner.stop()
    console.log(prettyjson.render(invite))
  } else {
    spinner.stop()
    return console.error(`${chalk.red('No order ID provided. Please provide one using -o or --order.')}`)
  }
}

const getDealerSelection = async () => {
  const questions = [
    {
      name: 'dealer',
      type: 'list',
      message: 'Choose a dealer:',
      choices: await getDealers(),
    },
  ]
  return inquirer.prompt(questions)
}

const getDealers = async () => {
  const token = conf.get('auth.token')
  const spinner = ora().start('Fetching dealers...')
  let dealers = await request.get({
    url: `https://dealer.api.leisurevans.com/dealers`,
    token: token,
  })
  const updateDealers = await dealers.map(({ dealerId, name }) => ({ value: dealerId, name: name }))
  spinner.stop()
  return updateDealers
}
