/**
 * @name Items
 * @description
 * @author darcrand
 */

'use client'

import { apiItem } from '@/services/item'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useState } from 'react'

export default function Items() {
  const [query, setQuery] = useState({ page: 1, pageSize: 10 })

  const { data } = useQuery({
    queryKey: ['items', query],
    queryFn: () => apiItem.pages(query),
  })

  return (
    <>
      <h1>Items</h1>

      <header>
        <Link href={'/admin/items/create'}>Create</Link>
      </header>

      <ul className='space-y-2'>
        {data?.data?.records?.map((item) => (
          <li key={item.id}>
            <Link href={`/admin/items/${item.id}`}>{item.title}</Link>
          </li>
        ))}
      </ul>

      <p>total: {data?.data?.total}</p>
    </>
  )
}
