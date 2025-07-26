// src/api/modules/user.api.ts
import request from '@/api/index'

/** 用户实体 */
export interface User {
  id: number
  username: string
  age: number
  email: string
  role: string
  createTime: string
  lastLogin: string
  remark: string
}

/** 分页返回包装 */
export interface PageResult<T> {
  data: T[]
  total: number
}

/**
 * 分页获取用户列表
 * @param params 查询 + 分页参数
 */
export const fetchUsers = (params: {
  username?: string
  email?: string
  page: number
  pageSize: number
}) =>
  request.get<PageResult<User>>('/api/pl-mag/user-manage/user/list', { params })

/**
 * 根据 id 获取单条用户详情
 * @param id 用户主键
 */
export const fetchUserDetail = (id: number) =>
  request.get<User>(`/users/${id}`)

/**
 * 新增用户
 * @param data 不含 id 的用户信息
 */
export const addUser = (data: Omit<User, 'id'>) =>
  request.post('/users', data)

/**
 * 更新用户
 * @param id   用户主键
 * @param data 需要更新的字段（支持部分更新）
 */
export const updateUser = (id: number, data: Partial<Omit<User, 'id'>>) =>
  request.put(`/users/${id}`, data)

/**
 * 删除用户
 * @param id 用户主键
 */
export const delUser = (id: number) =>
  request.delete(`/users/${id}`)