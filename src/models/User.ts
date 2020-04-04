import { Document, model, Schema } from 'mongoose'

import hashPassword from '../utils/hashpassword'

export interface UserModel extends Document {
  name: string
  username: string
  email: string
  photo?: string
  password: string
  // Compare text password against encrypted one
  comparePassword: (password: string) => boolean
}
const UserSchema: Schema<UserModel> = new Schema(
  {
    name: String,
    username: { type: String, index: true, unique: true },
    email: { type: String, index: true, unique: true },
    photo: String,
    password: String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)
UserSchema.set('toJSON', {
  virtuals: true,
})
UserSchema.set('toObject', {
  virtuals: true,
})

/**
 * HOOKS
 */
UserSchema.pre<UserModel>('save', async function (next) {
  try {
    const user = this
    if (!user.isModified('password')) return next()
    user.password = hashPassword(user.password)
    next()
  } catch (error) {
    next(error)
  }
})

UserSchema.methods.comparePassword = function (password: string): boolean {
  return this.password === hashPassword(password)
}

export default model<UserModel>('User', UserSchema)
