import type { NextApiRequest, NextApiResponse } from 'next'

type ProxyResponse = {
  body?: string
  headers?: Record<string, string>
}

type ApiResponse = ProxyResponse | { error: string } | string

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    // Clean up headers that come from CORS from the studio
    const headers: Record<string, string> = {}
    const validHeaders = [
      'authorization',
      'content-type',
      'client-id',
      'select-record',
      'api-version',
      'grant_type',
    ] as const

    validHeaders.forEach(header => {
      if (req.headers[header]) {
        headers[header] = req.headers[header] as string
      }
    })

    const proxyRequest: RequestInit = { headers }

    if (req.body) {
      proxyRequest.method = 'POST'
      if (
        req.headers['content-type']?.includes('application/json') &&
        typeof req.body !== 'string'
      ) {
        proxyRequest.body = JSON.stringify(req.body)
      } else {
        proxyRequest.body = req.body
      }
    }

    const targetUrl = req.headers['x-url']
    if (!targetUrl) {
      return res.status(400).json({ error: 'Missing x-url header' })
    }

    const proxyResponse = await fetch(targetUrl as string, proxyRequest)
    const contentType = proxyResponse.headers.get('content-type') || ''

    if (contentType.includes('json')) {
      const data = await proxyResponse.json()
      return res.status(proxyResponse.status).json(data)
    } else {
      const chunks: Uint8Array[] = []
      const reader = proxyResponse.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        if (value) chunks.push(value)
      }
      
      const body = Buffer.concat(chunks).toString()
      return res.status(proxyResponse.status).send({body})
    }
  } catch (error) {
    console.error('Proxy error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
} 