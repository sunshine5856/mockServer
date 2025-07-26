// src/mock/user.mock.ts
import Mock from 'mockjs'

const total = 100;
let list = Mock.mock({
  [`list|${total}`]: [{
    'id|+1': 1,
    username: '@cname',
    age: '@integer(18,50)',
    email: '@email',
    role: '@pick(["管理员","用户"])',
    createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    lastLogin: '@datetime("yyyy-MM-dd HH:mm:ss")',
    remark: '@csentence(10,20)'
  }]
}).list

// vite-plugin-mock 3.x 要求：必须导出数组
export default [
  {
    url: '/api/pl-mag/user-manage/user/list',
    method: 'get',
    response: ({ query }) => {
      const { username = '', email = '', page = 1, pageSize = 10 } = query
      let data = list.filter(
        (u: any) =>
          u.username.includes(username) &&
          (u.email.includes(email))
      )
      const totalCount = data.length
      const start = (page - 1) * pageSize
      const end = start + Number(pageSize)
      data = data.slice(start, end)

      return { code: 0, data, total: totalCount }
    }
  },
  {
    url: '/users',
    method: 'post',
    response: ({ body }) => {
      const item = { id: Date.now(), ...body }
      list.unshift(item)
      return { code: 0, data: item }
    }
  },
  {
    url: '/users/:id',
    method: 'delete',
    response: ({ query }) => {
      list = list.filter((u: any) => u.id !== Number(query.id))
      return { code: 0 }
    }
  },
  {
    url: '/users/:id',
    method: 'put',
    response: ({ body, query }) => {
      const idx = list.findIndex((u: any) => u.id === Number(query.id))
      if (idx > -1) Object.assign(list[idx], body)
      return { code: 0 }
    }
  },
  {
    url: '/users/:id',
    method: 'get',
    response: ({ query }) => {
      const id = Number(query.id)
      const item = list.find((u: any) => u.id === id)
      return item ? { code: 0, data: item } : { code: 404, message: '未找到' }
    }
  }
]
