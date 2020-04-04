import { createHmac } from 'crypto';

export default function hashPassword(password: string) {
  let hmac = createHmac('sha256', process.env.APP_KEY || 'akumzy').update(Buffer.from(password))
  return hmac.digest('hex')
}
