import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Use localStorage on client side' })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ success: true })
}