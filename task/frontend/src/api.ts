import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
})

export const placeholder = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com'
})

export const usingBackend = Boolean(import.meta.env.VITE_API_URL)