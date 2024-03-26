const BASE_URL = process.env.NEXT_PUBLIC_API_URL

const fetchApi = async (endpoint, { method = 'GET', body = null, headers = {} } = {}) => {
  const token = typeof window !== 'undefined' ? localStorage?.getItem('token') : undefined

  if (token) {
    headers.Authorization = `Bearer ${token}`
    headers.auth = token
  }

  const options = {
    method,
    headers: {
      ...headers,
    },
  }

  if (body) {
    options.body = JSON.stringify(body)
    options.headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options)

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  if (response.headers.get('Content-Type')?.includes('application/json')) {
    return await response.json()
  }
  return {}
}

export default fetchApi
