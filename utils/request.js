const fetch = require('node-fetch')
const { version } = require('../package.json')

const request = {
  get: async options => {
    const qs = options.query ? serialize(options.query) : null
    const url = qs ? options.url + qs : options.url
    delete options.url
    delete options.query
    options.headers = {
      'x-access-token': options.token,
      'User-Agent': `LTV CLI v${version}`,
    }

    return fetch(url, options).then(resp => {
      return resp.json()
    })
  },
  post: async options => {
    const qs = options.query ? serialize(options.query) : null
    const url = qs ? options.url + qs : options.url
    options.method = 'POST'
    delete options.url
    delete options.query
    options.headers = {
      'x-access-token': options.token,
      'Content-Type': 'application/json',
      'User-Agent': `LTV CLI v${version}`,
    }
    options.body = JSON.stringify(options.body)

    return fetch(url, options).then(resp => {
      return resp.json()
    })
  },
}

const serialize = query => {
  return (
    '?' +
    Object.keys(query)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(query[key]))
      .join('&')
  )
}

module.exports = request
