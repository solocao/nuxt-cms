<template>
  <div class="admin-list">
    <div class="flex-row-sb">
      <el-button type="success" @click="postData">新增</el-button>
    </div>
    <div class="table-container">
      <el-table
        :data="table"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="机构名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="link"
          label="链接地址"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          sortable
          prop="createdAt"
          label="创建日期"
          width="130"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="170">
          <template slot-scope="scope">
            <el-button @click="checkRow(scope.row)" type="text" size="small">{{ $t('admin.page.check') }}</el-button>
            <el-button @click="editRow(scope.row.id)" type="text" size="small">{{ $t('admin.page.edit') }}</el-button>
            <el-button @click="deleteRow(scope.$index,table)" type="text" size="small">{{ $t('admin.page.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-size="pageSize"
        :page-sizes="[10, 20, 30, 40, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog :visible.sync="dialogTableVisible">
      <div class="title"><img :src="dialog.imgPath"></div>
      <div class="title">机构名称：{{dialog.name}}</div>
      <div class="title">链接地址：{{dialog.link}}</div>
      <div class="title">日期：{{dialog.createdAt}}</div>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    layout: 'admin',
    middleware: 'auth',
    methods: {
      postData(){
        this.$router.push('/admin/logos/editor')
      },
      async handleSizeChange(val) {
        this.pageSize = val
        let res = await this.$store.dispatch('logo/GET_LOGOS',`?pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
        this.table = res.data
      },
      async handleCurrentChange(val) {
        this.pageIndex = val
        let res = await this.$store.dispatch('logo/GET_LOGOS',`?pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
        this.table = res.data
      },
      checkRow(row) {
        this.dialog = row
        this.dialogTableVisible = true
      },
      deleteRow(index, rows) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          //先删数据库
          let res = await this.$store.dispatch('logo/DEL_LOGO',rows[index].id)
          if(res.success){
            rows.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }else {
            this.$message({
              type: 'error',
              message: res.message
            })
          }
        })
      },
      editRow(id){
        this.$router.push(`/admin/logos/editor?id=${id}`)
      }
    },
    async asyncData({store}){
      let res = await store.dispatch('logo/GET_LOGOS','')
      return{
        table:res.data,
        total:res.total
      }
    },
    data(){
      return{
        table: [],
        total: null,
        pageIndex: 1,
        pageSize: 10,
        dialog: {},
        dialogTableVisible: false
      }
    }
  }
</script>
