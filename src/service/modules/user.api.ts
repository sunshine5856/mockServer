import request from '@/service/request'

export interface User {
  id?: number
  name: string
  age: number
  email: string
  role: string
  createTime?: string
  lastLogin?: string
  remark?: string
}

export const getUsers = (params: { name?: string; age?: string }) =>
  request.get<User[]>('/users', { params })

export const addUser = (data: Omit<User, 'id'>) =>
  request.post('/users', data)

export const delUser = (id: number) =>
  request.delete(`/users/${id}`)

export const updateUser = (id: number, data: Partial<User>) =>
  request.put(`/users/${id}`, data)