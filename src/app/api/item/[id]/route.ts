import { db } from '@/lib/db'
import { UpdateItemDto } from '@/lib/db/models/item.model'
import { NextRequest, NextResponse } from 'next/server'

// get detail
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  const res = await db.item.getById(parseInt(id))
  return NextResponse.json(res)
}

// update
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const body: UpdateItemDto = await request.json()
  const updated = await db.item.update(parseInt(id), body)
  return NextResponse.json({ id: updated })
}

// delete
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const removed = await db.item.remove(parseInt(id))
  return NextResponse.json({ id: removed })
}
