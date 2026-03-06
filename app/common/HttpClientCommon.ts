// app/common/httpClient.ts

class HttpClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private request(method: string, body?: unknown): RequestInit {
    return {
      method,
      headers: { 'Content-Type': 'application/json' },
      ...(body !== undefined && { body: JSON.stringify(body) }),
    }
  }

  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`)
    if (!res.ok) throw new Error(`GET ${path} failed`)
    return res.json()
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, this.request('POST', body))
    if (!res.ok) throw new Error(`POST ${path} failed`)
    return res.json()
  }

  async patch<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, this.request('PATCH', body))
    if (!res.ok) throw new Error(`PATCH ${path} failed`)
    return res.json()
  }

  async delete<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, this.request('DELETE'))
    if (!res.ok) throw new Error(`DELETE ${path} failed`)
    return res.json()
  }
}

export const http = new HttpClient(process.env.NEXT_PUBLIC_API_URL!)