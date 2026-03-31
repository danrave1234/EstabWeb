import { NextResponse } from 'next/server'

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/ai/populate-template', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const mockRateLimit = jest.fn()
const mockGetClientIp = jest.fn()
const mockScrapeUrlWithApify = jest.fn()
const mockUpload = jest.fn()
const mockGetPublicUrl = jest.fn()

jest.mock('@/lib/security/rate-limit', () => ({
  rateLimit: (...args: unknown[]) => mockRateLimit(...args),
  getClientIp: (...args: unknown[]) => mockGetClientIp(...args),
  RATE_LIMIT_PRESETS: {
    ai: {},
  },
}))

jest.mock('@/lib/utils/scraper', () => ({
  scrapeUrlWithApify: (...args: unknown[]) => mockScrapeUrlWithApify(...args),
}))

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    storage: {
      from: jest.fn(() => ({
        upload: (...args: unknown[]) => mockUpload(...args),
        getPublicUrl: (...args: unknown[]) => mockGetPublicUrl(...args),
      })),
    },
  })),
}))

describe('POST /api/ai/populate-template', () => {
  let POST: (req: Request) => Promise<NextResponse>
  let fetchMock: jest.Mock
  let uploadCounter = 0

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()

    process.env.GEMINI_API_KEY = 'test-key'
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://supabase.example.com'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key'

    mockRateLimit.mockResolvedValue({ allowed: true })
    mockGetClientIp.mockReturnValue('127.0.0.1')
    mockScrapeUrlWithApify.mockResolvedValue({
      title: 'Shine Auto Spa',
      description: 'Premium detailing and ceramic coating.',
      logoUrl: 'https://fbcdn.example.com/logo.jpg',
      heroImageUrl: 'https://fbcdn.example.com/cover.jpg',
      about: 'Professional detailing shop offering ceramic coating, paint correction, and interior restoration.',
      recentPosts: [
        {
          text: 'Fresh ceramic coating package for an SUV.',
          imageUrl: 'https://fbcdn.example.com/post-1.jpg',
        },
      ],
      pagePhotos: [
        'https://fbcdn.example.com/page-1.jpg',
        'https://fbcdn.example.com/page-2.jpg',
      ],
    })

    mockUpload.mockResolvedValue({ error: null })
    uploadCounter = 0
    mockGetPublicUrl.mockImplementation(() => {
      uploadCounter += 1
      return {
        data: {
          publicUrl: `https://cdn.example.com/upload-${uploadCounter}.jpg`,
        },
      }
    })

    fetchMock = jest.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString()
      const headers = new Headers(init?.headers)
      const userAgent = headers.get('User-Agent') || headers.get('user-agent') || ''
      const referer = headers.get('Referer') || headers.get('referer') || ''

      if (url.includes('generativelanguage.googleapis.com')) {
        return new Response(
          JSON.stringify({
            candidates: [
              {
                content: {
                  parts: [
                    {
                      text: JSON.stringify({
                        brandName: 'Shine Auto Spa',
                        heroTitle: 'Auto Detailing That Turns Heads',
                        heroSubtitle: 'Ceramic coating, paint correction, and interior restoration for daily drivers and show cars.',
                        contactEmail: 'hello@shineauto.example',
                        contactPhone: '0917 000 1111',
                        location: 'Quezon City',
                        theme: '',
                        colorTheme: '',
                        typographyStyle: '',
                        headerStyle: '',
                        footerStyle: '',
                        darkMode: false,
                        activeSections: ['gallery--grid', 'services--vertical-tabs', 'team--showcase'],
                        logoUrl: 'https://images.example.com/logo-ai.jpg',
                        heroImageUrl: 'https://images.example.com/hero-ai.jpg',
                        sectionsData: {
                          galleryGrid: {
                            title: 'Recent Work',
                            images: [
                              {
                                id: 'gallery-1',
                                url: 'https://images.example.com/hero-ai.jpg',
                                title: 'Exterior detail',
                                category: 'All',
                              },
                              {
                                id: 'gallery-2',
                                url: 'https://images.example.com/hero-ai.jpg',
                                title: 'Interior restoration',
                                category: 'All',
                              },
                              {
                                id: 'gallery-3',
                                url: 'https://images.example.com/hero-ai.jpg',
                                title: 'Wheel deep clean',
                                category: 'All',
                              },
                            ],
                          },
                          verticalTabs: {
                            title: 'Detailing Services',
                            services: [
                              {
                                id: 'service-1',
                                title: 'Ceramic Coating',
                                description: 'Long-lasting gloss and paint protection.',
                                image: 'https://images.example.com/hero-ai.jpg',
                              },
                            ],
                          },
                          teamShowcase: {
                            members: [
                              {
                                name: 'Ava Santos',
                                role: 'Lead Detailer',
                                image: 'https://images.example.com/hero-ai.jpg',
                              },
                            ],
                          },
                        },
                      }),
                    },
                  ],
                },
              },
            ],
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }

      if (url.includes('facebook.com')) {
        return new Response('<html><head><title>Blocked</title></head><body></body></html>', {
          status: 200,
          headers: { 'Content-Type': 'text/html' },
        })
      }

      if (url.includes('fbcdn.example.com/photos-') || url.includes('fbcdn.example.com/page-')) {
        if (!userAgent.includes('Mozilla/5.0') || !referer.includes('facebook.com')) {
          return new Response('Forbidden', {
            status: 403,
            headers: { 'Content-Type': 'text/plain' },
          })
        }

        return new Response(Uint8Array.from([1, 2, 3, 4]), {
          status: 200,
          headers: { 'Content-Type': 'image/jpeg' },
        })
      }

      if (url.includes('fbcdn.example.com') || url.includes('images.example.com')) {
        return new Response(Uint8Array.from([1, 2, 3, 4]), {
          status: 200,
          headers: { 'Content-Type': 'image/jpeg' },
        })
      }

      throw new Error(`Unhandled fetch for ${url}`)
    })

    global.fetch = fetchMock as unknown as typeof fetch
    POST = require('@/app/api/ai/populate-template/route').POST
  })

  it('replaces non-hero cover-photo reuse with hosted scraped photos before returning template data', async () => {
    const res = await POST(
      makeRequest({
        prompt: 'Build a detailing website',
        businessPageUrl: 'https://www.facebook.com/shineautospa',
        options: {
          sections: [
            { id: 'gallery--grid', label: 'Gallery Grid' },
            { id: 'services--vertical-tabs', label: 'Vertical Tabs' },
            { id: 'team--showcase', label: 'Team Showcase' },
          ],
        },
      })
    )
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.logoUrl).toMatch(/^https:\/\/cdn\.example\.com\/upload-\d+\.jpg$/)
    expect(json.heroImageUrl).toMatch(/^https:\/\/cdn\.example\.com\/upload-\d+\.jpg$/)
    expect(json.logoUrl).not.toBe('https://images.example.com/logo-ai.jpg')
    expect(json.heroImageUrl).not.toBe('https://images.example.com/hero-ai.jpg')
    expect(json.sectionsData.galleryGrid.images).toHaveLength(3)
    for (const image of json.sectionsData.galleryGrid.images) {
      expect(image.url).toMatch(/^https:\/\/cdn\.example\.com\/upload-\d+\.jpg$/)
      expect(image.url).not.toBe(json.heroImageUrl)
    }
    expect(new Set(json.sectionsData.galleryGrid.images.map((image: { url: string }) => image.url)).size).toBeGreaterThan(1)
    expect(json.sectionsData.galleryGrid.items).toBeUndefined()
    expect(json.sectionsData.verticalTabs.services[0].image).toMatch(/^https:\/\/cdn\.example\.com\/upload-\d+\.jpg$/)
    expect(json.sectionsData.teamShowcase.members[0].image).toMatch(/^https:\/\/cdn\.example\.com\/upload-\d+\.jpg$/)
    expect(json.sectionsData.verticalTabs.services[0].image).not.toBe(json.heroImageUrl)
    expect(json.sectionsData.teamShowcase.members[0].image).not.toBe(json.heroImageUrl)
  })

  it('scrapes the dedicated Facebook photos page when the main page scrape has no compiled gallery photos', async () => {
    mockScrapeUrlWithApify.mockImplementation(async (url: string) => {
      if (url === 'https://www.facebook.com/shineautospa') {
        return {
          title: 'Shine Auto Spa',
          description: 'Premium detailing and ceramic coating.',
          logoUrl: 'https://fbcdn.example.com/logo.jpg',
          heroImageUrl: 'https://fbcdn.example.com/cover.jpg',
          about: 'Professional detailing shop offering ceramic coating, paint correction, and interior restoration.',
          recentPosts: [],
          pagePhotos: [],
        }
      }

      if (url === 'https://www.facebook.com/shineautospa/photos') {
        return {
          title: 'Shine Auto Spa Photos',
          description: 'Recent work gallery.',
          logoUrl: '',
          heroImageUrl: '',
          about: '',
          recentPosts: [],
          pagePhotos: [
            'https://fbcdn.example.com/photos-1.jpg',
            'https://fbcdn.example.com/photos-2.jpg',
            'https://fbcdn.example.com/photos-3.jpg',
          ],
        }
      }

      return null
    })

    const res = await POST(
      makeRequest({
        prompt: 'Build a detailing website',
        businessPageUrl: 'https://www.facebook.com/shineautospa',
        options: {
          sections: [
            { id: 'gallery--grid', label: 'Gallery Grid' },
            { id: 'services--vertical-tabs', label: 'Vertical Tabs' },
            { id: 'team--showcase', label: 'Team Showcase' },
          ],
        },
      })
    )
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(mockScrapeUrlWithApify).toHaveBeenNthCalledWith(1, 'https://www.facebook.com/shineautospa')
    expect(mockScrapeUrlWithApify).toHaveBeenNthCalledWith(2, 'https://www.facebook.com/shineautospa/photos')
    expect(json.sectionsData.galleryGrid.images).toHaveLength(3)
    expect(new Set(json.sectionsData.galleryGrid.images.map((image: { url: string }) => image.url)).size).toBe(3)
    expect(json.sectionsData.galleryGrid.images[0].url).toMatch(/^https:\/\/cdn\.example\.com\/upload-\d+\.jpg$/)
    expect(json.sectionsData.galleryGrid.images[0].url).not.toBe(json.heroImageUrl)
    expect(json.pageSignals.pagePhotos).toHaveLength(3)
  })
})