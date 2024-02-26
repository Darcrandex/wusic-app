import { DataModel } from '../idb-client'

export type ItemModel = DataModel & {
  title: string
  description?: string

  coverUrl?: string
  fileUrl?: string
}

export type CreateItemDto = Omit<ItemModel, 'id' | 'updatedAt'>

export type UpdateItemDto = Partial<Omit<ItemModel, 'updatedAt'>> & {
  id: number
}
