import { Document, model, Schema } from 'mongoose'

export interface AuthTokenModel extends Document {
  user_id: string
  revoke: boolean
}
const AuthTokenSchema: Schema<AuthTokenModel> = new Schema(
  { user_id: Schema.Types.ObjectId, revoke: Boolean },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)
AuthTokenSchema.set('toJSON', {
  virtuals: true,
})
AuthTokenSchema.set('toObject', {
  virtuals: true,
})
export default model<AuthTokenModel>('AuthToken', AuthTokenSchema)
