const defaultFetch = (info: RequestInfo, method: string, body: object | undefined): Promise<Response> => {
  return fetch(info, {
    method,
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  })
}

export default defaultFetch
