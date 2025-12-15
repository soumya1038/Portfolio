import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'

const DATA_FILE = join(process.cwd(), 'portfolio-data.json')

export async function GET() {
  try {
    const data = await readFile(DATA_FILE, 'utf8')
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    return NextResponse.json({ error: 'No data found' }, { status: 404 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    await writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}