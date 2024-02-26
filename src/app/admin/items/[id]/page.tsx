/**
 * @name ItemDetail
 * @description
 * @author darcrand
 */

'use client'

import { apiItem } from '@/services/item'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'

export default function ItemDetail() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const id = useParams().id as string

  const { data } = useQuery({
    queryKey: ['item', id],
    enabled: !!id,
    queryFn: () => apiItem.getById(parseInt(id)),
  })

  const { mutate } = useMutation({
    mutationFn: () => apiItem.remove(parseInt(id)),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      router.replace('/admin/items')
    },
  })

  return (
    <>
      <h1>ItemDetail</h1>
      <p>title: {data?.data.title}</p>

      <hr />

      <button onClick={() => mutate()}>remove</button>
    </>
  )
}
