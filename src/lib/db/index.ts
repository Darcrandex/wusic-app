import { IDBClient } from './idb-client'
import { ItemModel } from './models/item.model'
import { UserModel } from './models/user.model'

const client = new IDBClient({
  owner: process.env.NEXT_GITHUB_OWNER as string,
  repo: process.env.NEXT_GITHUB_REPO as string,
  auth: process.env.NEXT_GITHUB_TOKEN as string,
})

export const db = {
  user: client.createService<UserModel>('user'),
  item: client.createService<ItemModel>('item'),
}
