<template>
  <div class="app-container">

    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="关 键 字">
              <el-input v-model="searchObj.keyword" placeholder="用户名/姓名/手机号码" style="width: 95%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作时间">
              <el-date-picker
                v-model="createTimes"
                end-placeholder="结束时间"
                range-separator="至"
                start-placeholder="开始时间"
                style="margin-right: 10px;width: 100%;"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button :loading="loading" icon="el-icon-search" size="mini" type="primary" @click="fetchData()">搜索
          </el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
          <el-button
            :disabled="$hasBP('bnt.sysUser.add') === false"
            icon="el-icon-plus"
            size="mini"
            type="success"
            @click="add"
          >添 加
          </el-button>
        </el-row>
      </el-form>
    </div>

    <!-- 工具条 -->
    <!--    <div class="tools-div">-->
    <!--      <el-button type="success" icon="el-icon-plus" size="mini" @click="add">添 加</el-button>-->
    <!--    </div>-->

    <!-- 列表 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      stripe
      style="width: 100%;margin-top: 10px;"
    >

      <el-table-column
        align="center"
        label="序号"
        width="70"
      >
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column label="用户名" prop="username" width="100" />
      <el-table-column label="姓名" prop="name" width="70" />
      <el-table-column label="手机" prop="phone" width="120" />
      <el-table-column label="岗位" prop="postName" width="100" />
      <el-table-column label="部门" prop="deptName" width="100" />
      <el-table-column label="所属角色" width="130">
        <template slot-scope="scope">
          <span v-for="item in scope.row.roleList" :key="item.id" style="margin-right: 10px;">{{ item.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status === 1"
            @change="switchStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="160" />

      <el-table-column align="center" fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            :disabled="$hasBP('bnt.sysUser.update') === false"
            icon="el-icon-edit"
            size="mini"
            title="修改"
            type="primary"
            @click="edit(scope.row.id)"
          />
          <el-button
            :disabled="$hasBP('bnt.sysUser.remove') === false"
            icon="el-icon-delete"
            size="mini"
            title="删除"
            type="danger"
            @click="removeDataById(scope.row.id)"
          />
          <el-button
            :disabled="$hasBP('bnt.sysUser.assignRole') === false"
            icon="el-icon-baseball"
            size="mini"
            title="分配角色"
            type="warning"
            @click="showAssignRole(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      :total="total"
      layout="sizes, prev, pager, next, jumper, ->, total, slot"
      style="padding: 30px 0; text-align: center;"
      @current-change="fetchData"
      @size-change="changeSize"
    />

    <el-dialog :visible.sync="dialogVisible" title="添加/修改" width="40%">
      <el-form ref="dataForm" :model="sysUser" label-width="100px" size="small" style="padding-right: 40px;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="sysUser.username" />
        </el-form-item>
        <el-form-item v-if="!sysUser.id" label="密码" prop="password">
          <el-input v-model="sysUser.password" type="password" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="sysUser.name" />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="sysUser.phone" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button icon="el-icon-refresh-right" size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button icon="el-icon-check" size="small" type="primary" @click="saveOrUpdate()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogRoleVisible" title="分配角色">
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input :value="sysUser.username" disabled />
        </el-form-item>

        <el-form-item label="角色列表">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选
          </el-checkbox>
          <div style="margin: 15px 0;" />
          <el-checkbox-group v-model="userRoleIds" @change="handleCheckedChange">
            <el-checkbox v-for="role in allRoles" :key="role.id" :label="role.id">{{ role.roleName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" type="primary" @click="assignRole">保存</el-button>
        <el-button size="small" @click="dialogRoleVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/system/sysUser'
import roleApi from '@/api/system/sysRole'

const defaultForm = {
  id: '',
  username: '',
  password: '',
  name: '',
  phone: '',
  status: 1
}
export default {
  data() {
    return {
      listLoading: true, // 数据是否正在加载
      list: null, // banner列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      searchObj: {}, // 查询表单对象

      createTimes: [],

      dialogVisible: false,
      sysUser: defaultForm,
      saveBtnDisabled: false,

      dialogRoleVisible: false,
      allRoles: [], // 所有角色列表
      userRoleIds: [], // 用户的角色ID的列表
      isIndeterminate: false, // 是否是不确定的
      checkAll: false // 是否全选
    }
  },

  // 生命周期函数：内存准备完毕，页面尚未渲染
  created() {
    console.log('list created......')
    this.fetchData()

    roleApi.findAll().then(response => {
      this.roleList = response.data
    })
  },

  // 生命周期函数：内存准备完毕，页面渲染成功
  mounted() {
    console.log('list mounted......')
  },

  methods: {
    // 当页码发生改变的时候
    changeSize(size) {
      console.log(size)
      this.limit = size
      this.fetchData(1)
    },

    // 加载banner列表数据
    fetchData(page = 1) {
      this.page = page
      console.log('翻页。。。' + this.page)

      if (this.createTimes && this.createTimes.length === 2) {
        this.searchObj.createTimeBegin = this.createTimes[0]
        this.searchObj.createTimeEnd = this.createTimes[1]
      }

      api.getPageList(this.page, this.limit, this.searchObj).then(
        response => {
          // this.list = response.data.list
          this.list = response.data.records
          this.total = response.data.total

          // 数据加载并绑定成功
          this.listLoading = false
        }
      )
    },

    // 重置查询表单
    resetData() {
      console.log('重置查询表单')
      this.searchObj = {}
      this.createTimes = []
      this.fetchData()
    },

    // 根据id删除数据
    removeDataById(id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // promise
        // 点击确定，远程调用ajax
        return api.removeById(id)
      }).then((response) => {
        this.fetchData()
        this.$message.success(response.message || '删除成功')
      }).catch(() => {
        this.$message.info('取消删除')
      })
    },

    // -------------
    add() {
      this.dialogVisible = true
      this.sysUser = Object.assign({}, defaultForm)
    },

    edit(id) {
      this.dialogVisible = true
      this.fetchDataById(id)
    },

    fetchDataById(id) {
      api.getById(id).then(response => {
        this.sysUser = response.data
      })
    },

    saveOrUpdate() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.saveBtnDisabled = true // 防止表单重复提交
          if (!this.sysUser.id) {
            this.saveData()
          } else {
            this.updateData()
          }
        }
      })
    },

    // 新增
    saveData() {
      api.save(this.sysUser).then(response => {
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    },

    // 根据id更新记录
    updateData() {
      api.updateById(this.sysUser).then(response => {
        this.$message.success(response.message || '操作成功')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    },

    showAssignRole(row) {
      this.sysUser = row
      this.dialogRoleVisible = true
      this.getRoles()
    },

    getRoles() {
      roleApi.getRoles(this.sysUser.id).then(response => {
        const { allRolesList, assginRoleList } = response.data
        this.allRoles = allRolesList
        this.userRoleIds = assginRoleList.map(item => item.id)
        this.checkAll = allRolesList.length === assginRoleList.length
        this.isIndeterminate = assginRoleList.length > 0 && assginRoleList.length < allRolesList.length
      })
    },

    /*
    全选勾选状态发生改变的监听
    */
    handleCheckAllChange(value) { // value 当前勾选状态true/false
      // 如果当前全选, userRoleIds就是所有角色id的数组, 否则是空数组
      this.userRoleIds = value ? this.allRoles.map(item => item.id) : []
      // 如果当前不是全选也不全不选时, 指定为false
      this.isIndeterminate = false
    },

    /*
    角色列表选中项发生改变的监听
    */
    handleCheckedChange(value) {
      const { userRoleIds, allRoles } = this
      this.checkAll = userRoleIds.length === allRoles.length && allRoles.length > 0
      this.isIndeterminate = userRoleIds.length > 0 && userRoleIds.length < allRoles.length
    },

    assignRole() {
      const assginRoleVo = {
        userId: this.sysUser.id,
        roleIdList: this.userRoleIds
      }
      roleApi.assignRoles(assginRoleVo).then(response => {
        this.$message.success(response.message || '分配角色成功')
        this.dialogRoleVisible = false
        this.fetchData(this.page)
      })
    },

    switchStatus(row) {
      row.status = row.status === 1 ? 0 : 1
      api.updateStatus(row.id, row.status).then(response => {
        if (response.code) {
          this.$message.success(response.message || '操作成功')
          this.dialogVisible = false
          this.fetchData()
        }
      })
    }
  }
}
</script>
