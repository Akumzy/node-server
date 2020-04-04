import { join } from 'path'

import Joi from '@hapi/joi'

const isDev = process.env.NODE_ENV !== 'production'
const envPath = join(__dirname, '..', '.env' + (isDev ? '.local' : ''))

require('dotenv').config({
  path: envPath,
})

const envVarsSchema = Joi.object({
  APP_KEY: Joi.string(),
  DB_HOST: Joi.string(),
  DB_PORT: Joi.number().required(),
  DB_DATABASE: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_AUTH_SOURCE: Joi.string().required(),
}).unknown(true)


const { error, value: envVars } = envVarsSchema.validate(process.env)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

export default {
  appKey: envVars.APP_KEY,
  emailLinkExpirationSeconds: 60 * 60,
  db: {
    database: envVars.DB_DATABASE,
    pass: envVars.DB_PASSWORD,
    user: envVars.DB_USERNAME,
    port: envVars.DB_PORT,
    host: envVars.DB_HOST,
    authSource: envVars.DB_AUTH_SOURCE,
  },
  token_cookie_options: {
    ttl: 7 * 24 * 60 * 60 * 1000, // expires a seven days from today
    encoding: 'none', // we already used JWT to encode
    isSecure: !isDev, // warm & fuzzy feelings
    isHttpOnly: false, // prevent client alteration
    clearInvalid: true, // remove invalid cookies
    strictHeader: true, // don't allow violations of RFC 6265,
    isSameSite: 'Lax',
    path: '/',
  },
}
