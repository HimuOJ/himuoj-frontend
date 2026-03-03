import createClient from 'openapi-fetch'

const getToken = () => localStorage.getItem('himuoj_access_token')

const createAuthClient = <T,>(path: string) => {
  const client = createClient<T>({ baseUrl: `/api${path}` })

  client.use({
    onRequest({ request }) {
      const token = getToken()
      if (token) {
        request.headers.set('Authorization', `Bearer ${token}`)
      }
      return request
    }
  })

  return client
}

export const problemsClient = createAuthClient('/problems')
export const submissionsClient = createAuthClient('/submissions')
export const objectsClient = createAuthClient('/objects')
