import { CreateItemDto, ItemModel, UpdateItemDto } from '@/lib/db/models/item.model'
import { http } from '@/utils/http'

export const apiItem = {
  create: (createDto: CreateItemDto) => http.post('/api/item', createDto),

  getById: (id: number) => http.get<ItemModel>(`/api/item/${id}`),

  update: (updateDto: UpdateItemDto) => http.put(`/api/item/${updateDto.id}`, updateDto),

  pages: (params?: { page?: number; pageSize?: number }) =>
    http.get<{
      records: ItemModel[]
      total: number
      page: number
      pageSize: number
    }>('/api/item', { params }),

  remove: (id: number) => http.delete(`/api/item/${id}`),
}
