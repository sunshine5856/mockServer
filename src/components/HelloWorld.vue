<template>
  <div class="page">
    <!-- 查询卡片 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="query" inline>
        <el-form-item label="用户名">
          <el-input v-model="query.username" clearable placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="用户邮箱">
          <el-input v-model="query.email" clearable placeholder="请输入用户邮箱" />
        </el-form-item>
  
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="dialogVisible = true">新增</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 列表卡片 -->
    <el-card shadow="never" class="list-card">
      <el-table :data="tableData" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="username" label="姓名" />
        <el-table-column prop="age" label="年龄" width="70" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="role" label="角色" />
        <el-table-column label="操作" width="220">
          <template #default="{ row }">
            <el-button size="small" @click="showDetail(row.id)">详情</el-button>
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="handleDelete(row.id)">
              <template #reference>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="query.page"
        v-model:page-size="query.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 16px; justify-content: flex-end"
        @size-change="handleQuery"
        @current-change="handleQuery"
      />
    </el-card>

    <!-- 新增 / 编辑弹窗（可复用） -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑账号' : '新增账号'" width="420px" @closed="resetForm">
      <el-form ref="formRef" :model="form" label-width="60px" :rules="rules">
        <el-form-item label="姓名" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="form.age" :min="1" :max="120" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" style="width:100%">
            <el-option label="管理员" value="管理员" />
            <el-option label="用户" value="用户" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情抽屉 -->
    <el-drawer v-model="detailVisible" title="用户详情" direction="rtl" size="400">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="ID">{{ detail.id }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ detail.username }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{ detail.age }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ detail.email }}</el-descriptions-item>
        <el-descriptions-item label="角色">{{ detail.role }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detail.createTime }}</el-descriptions-item>
        <el-descriptions-item label="最后登录">{{ detail.lastLogin }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ detail.remark }}</el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { fetchUsers, fetchUserDetail, addUser, updateUser, delUser } from '@/api/modules/user.ts'
import type { User } from '@/api/modules/user.ts'

// 查询 + 分页参数
const query = reactive({
  username: '',
  email: undefined as number | undefined,
  page: 1,
  pageSize: 10
})
const tableData = ref<User[]>([])
const total = ref(0)

// 弹窗 / 抽屉
const dialogVisible = ref(false)
const detailVisible = ref(false)
const detail = ref<User>({} as User)

const form = reactive({
  username: '',
  age: 18,
  email: '',
  role: '用户'
})
const isEdit = ref(false)
const editId = ref<number>()

const rules = {
  username: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  age: [{ required: true, type: 'number', min: 1, max: 120, message: '年龄 1-120', trigger: 'blur' }],
  email: [{ required: true, type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

// 查
const loadData = async () => {
  const { data, total: t } = await fetchUsers(query)
  tableData.value = data.data
  console.log(t, 'rr')
  total.value = data.total
}
const handleQuery = () => {
  query.page = 1
  loadData()
}
const handleReset = () => {
  query.username = ''
  query.email = undefined
  handleQuery()
}

// 详情
const showDetail = async (id: number) => {
  const { data } = await fetchUserDetail(id)
  detail.value = data.data
  detailVisible.value = true
}

// 增 / 改 / 删
const handleEdit = (row: User) => {
  isEdit.value = true
  editId.value = row.id
  Object.assign(form, row)
  dialogVisible.value = true
}
const handleDelete = async (id: number) => {
  await delUser(id)
  loadData()
}
const resetForm = () => {
  isEdit.value = false
  Object.assign(form, { username: '', age: 18, email: '', role: '用户' })
}
const submitForm = async () => {
  isEdit.value
    ? await updateUser(editId.value!, form)
    : await addUser(form)
  dialogVisible.value = false
  loadData()
}

onMounted(loadData)
</script>

<style scoped>
.page {
  padding: 24px;
  background: #f5f7fa;
}
.search-card,
.list-card {
  border: none;
  border-radius: 8px;
  margin-bottom: 16px;
}
</style>