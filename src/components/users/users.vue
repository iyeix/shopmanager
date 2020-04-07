<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/home'}">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: 'users'}">用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-row class="searchRow">
      <el-col>
          <!-- clear:在点击由clearable 属性生成的清空按钮时触发 -->
        <el-input @clear="loadUserList()" clearable placeholder="请输入内容" v-model="query" class="inputSearch">
          <el-button @click="srarchUser()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" plain @click="showAddUserDia()">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      :data="userlist"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="60">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="80">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>

      <!-- {{create_time | fmtdate}} -->
      <el-table-column
        label="创建日期">
        <!-- 单元格内显示的内容不是字符串，需要给被显示的内容外包裹一个template -->
        <!-- template内要用数据，设置slot-scope属性，
        该属性的值是要用数据的数据源userlist,
        该属性会自动查找上一级数据，故习惯slot-scope="scope"，
        scope.row->数组中的每个对象
         -->
        <template slot-scope="scope">{{scope.row.create_time | fmtdate}}</template>
      </el-table-column>

      <el-table-column
        label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column
        prop="???"
        label="操作">
        <template slot-scope="scope">
          <el-button
          size="mini"
          plain
          type="primary"
          icon="el-icon-edit"
          circle
          @click="showEditUserDia(scope.row)"></el-button>
          <el-button
           size="mini"
           plain
           type="danger"
           icon="el-icon-delete"
           circle
           @click="showDeleUserMsgBox(scope.row.id)"></el-button>
          <el-button size="mini" plain type="success" icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 对话框 -->
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="form">
        <el-form-item label="密 码" label-width="100px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="form">
        <el-form-item label="邮 箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="form">
        <el-form-item label="电 话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户的对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="* 用户名" label-width="100px">
          <el-input disabled v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="form">
        <el-form-item label="邮 箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="form">
        <el-form-item label="电 话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      // 表格绑定数据
      userlist: [],
      // 分页相关数据
      total: -1,
      // 添加对话框的属性
      dialogFormVisibleAdd: false,
      // 添加用户的表单数据
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加对话框的属性
      dialogFormVisibleEdit: false
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
      const {meta: {msg, status}, data: {users, total}} = res.data
      if (status === 200) {
        // 给表格数据赋值
        this.userlist = users
        // 给total赋值
        this.total = total
        // 提示
        this.$message.success(msg)
      } else {
        // 提示
        this.$message.warning(msg)
      }
    },
    // 搜索用户
    srarchUser () {
      this.getUserList()
    },
    // 清空搜索框，重新获取数据
    loadUserList () {
      this.getUserList()
    },
    // 添加用户
    showAddUserDia () {
    // 显示对话框
      this.dialogFormVisibleAdd = true
      this.form = {}
    },
    async addUser () {
    // 发送请求
      this.dialogFormVisibleAdd = false
      const res = await this.$axios.post(`users`, this.form)
      console.log(res)
      const {meta: {status, msg}} = res.data
      if (status === 201) {
        // 提示成功
        this.$message.success(msg)
        // 更新视图
        this.getUserList()
        // 清空文本框
        this.form = {}
      } else {
        this.$message.warning(msg)
      }
      // 关闭对话框
      this.dialogFormVisibleAdd = false
    },
    // 删除
    showDeleUserMsgBox (userId) {
      // 删除用户,打开提醒框
      this.$confirm('删除用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 发送删除请求
        const res = await this.$axios.delete(`users/${userId}`)
        console.log(res)
        if (res.data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: res.data.meta.msg
          })
          this.getUserList()
          this.pagenum = 1
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 编辑
    showEditUserDia (user) {
      // 显示对话框
      this.form = user
      this.dialogFormVisibleEdit = true
    },
    async editUser () {
      // 发送请求
      const res = await this.$axios.put(`users/${this.form.id}`, this.form)
      console.log(res)
      this.dialogFormVisibleEdit = false
      this.getUserList()
    },
    // 分页相关
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      //   this.pagenum = 1
      this.getUserList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
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
