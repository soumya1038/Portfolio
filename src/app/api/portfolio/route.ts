import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET() {
  try {
    const [admin, projects] = await Promise.all([
      db.getAdmin(),
      db.getProjects()
    ])
    return NextResponse.json({ admin, projects })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { admin } = await request.json()
    await db.saveAdmin(admin)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save admin data' }, { status: 500 })
  }
}