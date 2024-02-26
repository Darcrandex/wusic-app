/**
 * @name ItemCreate
 * @description
 * @author darcrand
 */

'use client'

import { CreateItemDto } from '@/lib/db/models/item.model'
import { apiItem } from '@/services/item'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'

export default function ItemCreate() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { control, handleSubmit } = useForm<CreateItemDto>({
    defaultValues: { title: '', description: '', coverUrl: '', fileUrl: '' },
  })

  const { mutate } = useMutation({
    mutationFn: (createDto: CreateItemDto) => apiItem.create(createDto),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      router.replace('/admin/items')
    },
  })

  return (
    <>
      <h1>ItemCreate</h1>

      <Controller
        name='title'
        control={control}
        render={({ field }) => <input type='text' placeholder='title' {...field} />}
      />

      <Controller
        name='description'
        control={control}
        render={({ field }) => <input type='text' placeholder='title' {...field} />}
      />

      <button type='button' onClick={handleSubmit((data) => mutate(data))}>
        Create
      </button>
    </>
  )
}
