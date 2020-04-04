import JWT from 'jsonwebtoken';

export function signToken(payload: any) {
  let token = JWT.sign(payload, process.env.APP_KEY, {
    algorithm: 'HS256',
    expiresIn: '7d'
  })
  return token
}
