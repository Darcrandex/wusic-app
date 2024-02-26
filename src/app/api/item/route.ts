import { db } from '@/lib/db'
import { CreateItemDto } from '@/lib/db/models/item.model'
import { NextRequest, NextResponse } from 'next/server'

// create
export async function POST(request: NextRequest) {
  const body: CreateItemDto = await request.json()
  const created = await db.item.create(body)
  return NextResponse.json({ id: created })
}

// pages
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get('page') || '1')
  const pageSize = Number.parseInt(searchParams.get('pageSize') || '10')

  const res = await db.item.pages({ page, pageSize })

  const total = await db.item.count()

  return NextResponse.json({ records: res, total, page, pageSize })
}
