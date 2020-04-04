import mongoose from 'mongoose'

import config from '../config'

mongoose.set('useCreateIndex', true)
// mongoose.set('debug', true)
let conn: typeof mongoose
export default async function StartDatabase() {
  if (conn) return conn
  if (process.env.NODE_ENV === 'production') {
    if (process.env.DB_ATLAS) {
      conn = await mongoose.connect(process.env.DB_ATLAS, {
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true
      })
    } else {
      console.error('provide database url')
    }
  } else {
    conn = await mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.database}`, {
      user: config.db.user,
      pass: config.db.pass,
      authSource: config.db.authSource,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
  }

  console.log('Database connection established')
  return conn
}

export function mongooseInstance() {
  return conn
}
