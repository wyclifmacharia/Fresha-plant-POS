import { jwtDecode } from 'jwt-decode'

export function isTokenExpired() {
  const token = localStorage.getItem('accessToken')
  if (!token) return true

  const decodedToken = jwtDecode(token)
  const currentTime = Date.now() / 1000
  return decodedToken.exp < currentTime
}
