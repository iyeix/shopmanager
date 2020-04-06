<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/'}">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: 'users'}">用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-row class="searchRow">
      <el-col>
        <el-input placeholder="请输入内容" v-model="query" class="inputSearch">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" plain>添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="60">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="80">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="tel"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="data"
        label="创建日期">
      </el-table-column>
      <el-table-column
        prop="status"
        label="用户状态">
      </el-table-column>
      <el-table-column
        prop="do"
        label="操作">
      </el-table-column>
    </el-table>
    <!-- 分页 -->
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }
      ]
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    //   获取用户列表请求
    async getUserList () {
    //   需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
      const AUTH_TOKEN = localStorage.getItem('token')
      this.$axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$axios({
        // query查询参数可以为空
        // pagenum当前页码不能为空
        // pagesize每页显示条数不能为空
        url: `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
        methods: 'get'
      })
      console.log(res)
    }
  }
}
</script>

<style>
.box-card {
  height: 100%;
}
.searchRow{
  margin-top: 20px;
}
.inputSearch{
  width: 300px;
}
</style>
