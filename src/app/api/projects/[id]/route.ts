import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const project = await request.json()
    await db.updateProject(parseInt(params.id), project)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.deleteProject(parseInt(params.id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}