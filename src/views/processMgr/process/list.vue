<template>
  <div class="app-container">

    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="关 键 字">
              <el-input
                v-model="searchObj.keyword"
                placeholder="审批编号/标题/手机号码/姓名"
                style="width: 95%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              <el-select
                v-model="searchObj.status"
                placeholder="请选状态"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.status"
                  :label="item.name"
                  :value="item.status"
                />
              </el-select>
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
        </el-row>
      </el-form>
    </div>
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
      <el-table-column label="审批编号" prop="processCode" width="130" />
      <el-table-column label="标题" prop="title" width="180" />
      <el-table-column label="用户" prop="name" />
      <el-table-column label="审批类型" prop="processTypeName" />
      <el-table-column label="审批模板" prop="processTemplateName" />
      <el-table-column label="描述" prop="description" width="180" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row.status === 1 ? '审批中' : scope.row.status === 2 ? '完成' : '驳回' }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="160" />

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="show(scope.row.id)">查看</el-button>
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
  </div>
</template>

<script>
import api from '@/api/process/process'

export default {
  data() {
    return {
      listLoading: true, // 数据是否正在加载
      list: null, // banner列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      searchObj: {}, // 查询表单对象
      statusList: [
        { 'status': '1', 'name': '进行中' },
        { 'status': '2', 'name': '已完成' },
        { 'status': '-1', 'name': '驳回' }
      ],
      createTimes: []
    }
  },

  // 生命周期函数：内存准备完毕，页面尚未渲染
  created() {
    console.log('list created......')
    this.fetchData()
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
      console.log('翻页。。。' + page)
      // 异步获取远程数据（ajax）
      this.page = page

      if (this.createTimes && this.createTimes.length === 2) {
        this.searchObj.createTimeBegin = this.createTimes[0]
        this.searchObj.createTimeEnd = this.createTimes[1]
      }

      api.getPageList(this.page, this.limit, this.searchObj).then(
        response => {
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
      this.fetchData()
    },

    show(id) {
      console.log(id)
    }
  }
}
</script>
