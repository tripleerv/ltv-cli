const ora = require('ora')
const chalk = require('chalk')
const inquirer = require('inquirer')
const login = require('../utils/login')
const conf = require('../lib/config')

module.exports = async () => {
  const token = conf.get('auth.token')

  if (token) {
    console.info(chalk.green(`Already authenticated as ${conf.get('auth.user')}`))
  } else {
    const credentials = await getLTVCredentials()
    const spinner = ora().start('Logging in...')
    try {
      const user = await login(credentials.username, credentials.password)

      if (user.token) {
        conf.set('auth.user', user.user.email)
        conf.set('auth.token', user.token)
      }

      spinner.stop()

      console.info(chalk.green(`Successfully authenticated as ${user.user.email}`))
    } catch (e) {
      spinner.stop()
      console.error(e)
    }
  }
}

const getLTVCredentials = async () => {
  const questions = [
    {
      name: 'username',
      type: 'input',
      message: 'Enter your email address:',
      validate: value => {
        if (value.length) {
          return true
        } else {
          return 'Please enter your email address.'
        }
      },
    },
    {
      name: 'password',
      type: 'password',
      message: 'Enter your password:',
      validate: value => {
        if (value.length) {
          return true
        } else {
          return 'Please enter your password.'
        }
      },
    },
  ]
  return inquirer.prompt(questions)
}
