require('./config')
import JWT from 'hapi-auth-jwt2'
import HapiPino from 'hapi-pino'
import { join } from 'path'

import Hapi from '@hapi/hapi'
import Inert from '@hapi/inert'

import config from './config'
import StartDatabase from './database/mongodb'
import validateToken from './utils/validate-token'

const port = Number(process.env.PORT || '3000')
async function StartServer() {
  const server = new Hapi.Server({
    port,
    routes: {
      files: {
        relativeTo: join(__dirname, '../public'),
      },
      payload: {
        maxBytes: 1024 * 1025 * 50,
      },
    },
  })
  // Register plugins
  await server.register({ plugin: Inert })
  await server.register({ plugin: JWT })
  await server.register({
    plugin: HapiPino,
    options: {
      prettyPrint: true,
      // Redact Authorization headers, see https://getpino.io/#/docs/redaction
      redact: ['req.headers.cookie'],
    },
  })
  // Register authentication strategy
  server.auth.strategy('jwt', 'jwt', {
    key: config.appKey,
    verifyOptions: { algorithms: ['HS256'] },
    urlKey: false,
    cookieKey: 'token',
    tokenType: 'cookie',
    validate: validateToken,
  })
  // Register authentication cookie option
  server.state('token', config.token_cookie_options)
  server.auth.default('jwt')
  // Start Database
  await StartDatabase()
  await server.start()
  console.log(`> Ready on http://localhost:${port}`)
}
StartServer().catch((error) => {
  console.log('Error starting server')
  console.log(error)
  process.exit(0)
})
