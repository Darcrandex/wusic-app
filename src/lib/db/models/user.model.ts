import { DataModel } from '../idb-client'

export type UserModel = DataModel & {
  name: string
  email: string
}
