const fetch = require('node-fetch')
const { version } = require('../package.json')

module.exports = async (user, pass) => {
  const response = await fetch('https://dealer.api.leisurevans.com/auth/login', {
    method: 'post',
    body: JSON.stringify({
      username: user,
      password: pass,
    }),
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': `LTV CLI v${version}`,
    },
  })
  return response.json()
}
