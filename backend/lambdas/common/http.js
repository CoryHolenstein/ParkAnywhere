export const ok = (body) => ({
  statusCode: 200,
  headers: {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
  },
  body: JSON.stringify(body),
})

export const created = (body) => ({
  statusCode: 201,
  headers: {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
  },
  body: JSON.stringify(body),
})

export const badRequest = (message) => ({
  statusCode: 400,
  headers: {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
  },
  body: JSON.stringify({ message }),
})

export const notFound = (message) => ({
  statusCode: 404,
  headers: {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
  },
  body: JSON.stringify({ message }),
})

export const serverError = (message = 'Internal server error') => ({
  statusCode: 500,
  headers: {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
  },
  body: JSON.stringify({ message }),
})
