import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export interface SignInPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: { name: string; email: string }
}

export const signIn = (data: SignInPayload) =>
  api.post<AuthResponse>('/auth/signin', data)

export const register = (data: RegisterPayload) =>
  api.post<AuthResponse>('/auth/register', data)
