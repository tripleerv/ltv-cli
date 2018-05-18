const minimist = require('minimist')

module.exports = () => {
  const args = minimist(process.argv.slice(2))
  let cmd = args._[0] || 'help'

  if (args.version || args.v) {
    cmd = 'version'
  }

  if (args.help || args.h) {
    cmd = 'help'
  }

  switch (cmd) {
    case 'auth':
      require('./cmds/auth')(args)
      break
    case 'dealer':
      require('./cmds/dealer')(args)
      break
    case 'order':
      require('./cmds/order')(args)
      break
    case 'user':
      require('./cmds/user')(args)
      break
    case 'version':
      require('./cmds/version')(args)
      break
    case 'help':
      require('./cmds/help')(args)
      break
    default:
      console.error(`"${cmd}" is not a valid command!`)
      break
  }
}

process.on('unhandledRejection', r => console.log(r))
