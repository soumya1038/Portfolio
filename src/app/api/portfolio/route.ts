import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'
import { logger } from '@/lib/logger'

const DATA_FILE = join(process.cwd(), 'portfolio-data.json')

/**
 * GET /api/portfolio - Retrieve portfolio data
 */
export async function GET() {
  try {
    const data = await readFile(DATA_FILE, 'utf8')
    const parsed = JSON.parse(data)
    
    return NextResponse.json(parsed, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    logger.error('Failed to read portfolio data', error)
    
    return NextResponse.json(
      { 
        error: 'Portfolio data not found',
        message: 'Failed to retrieve portfolio data. Please try again later.' 
      },
      { status: 404 }
    )
  }
}

/**
 * POST /api/portfolio - Update portfolio data
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      logger.warn('Unauthorized portfolio update attempt')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Basic validation
    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'Invalid portfolio data format' },
        { status: 400 }
      )
    }

    // Validate required fields
    const requiredFields = ['name', 'title', 'bio', 'email']
    const missingFields = requiredFields.filter((field) => !(field in data))
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          missing: missingFields 
        },
        { status: 400 }
      )
    }

    await writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    logger.info('Portfolio data updated successfully')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      )
    }

    logger.error('Failed to save portfolio data', error)
    return NextResponse.json(
      { error: 'Failed to save portfolio data' },
      { status: 500 }
    )
  }
}