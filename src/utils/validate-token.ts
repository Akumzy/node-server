import Hapi from '@hapi/hapi'

import AuthToken from '../models/AuthToken'
import User from '../models/User'

export default async function (decoded: any, req: Hapi.Request, h: Hapi.ResponseToolkit) {
  let token = await AuthToken.findById(decoded.id)
  if (token) {
    if (token.revoke) {
      await token.remove()
      h.unstate('token')
      return { isValid: false }
    }
    let user = await (await User.findById(token.user_id, 'email username')).toObject()
    return { isValid: true, credentials: { user: { ...user, token_id: decoded.id } } }
  }
  return { isValid: false }
}
