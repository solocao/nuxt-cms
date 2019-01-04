<template>
  <div class="admin-list">
    <div class="flex-row-sb">
      <!--<el-button type="success" @click="postArticle">{{ $t('admin.page.users.create') }}</el-button>-->
      <el-select v-model="select" slot="prepend" :placeholder="$t('admin.page.article.typeFilter')" @change="handleChange">
        <el-option
          v-for="option in options"
          :key="option"
          :label="option"
          :value="option">
        </el-option>
      </el-select>
    </div>
    <div class="table-container">
      <el-table
        :data="table"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="role"
          label="角色"
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          width="170">
          <template slot-scope="scope">
            <el-button @click="checkRow(scope.row)" type="text" size="small">{{ $t('admin.page.check') }}</el-button>
            <el-button @click="editRow(scope.row.id)" type="text" size="small">{{ $t('admin.page.edit') }}</el-button>
            <!--<el-button @click="deleteRow(scope.$index,table)" type="text" size="small">{{ $t('admin.page.delete') }}</el-button>-->
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
      <div class="title">角色：{{dialog.role}}</div>
      <div class="title">名称：{{dialog.name}}</div>
      <div class="title">邮箱：{{dialog.email}}</div>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    layout: 'admin',
    middleware: 'auth',
    methods: {
      postArticle(){
        this.$router.push('/admin/articles/editor')
      },
      async handleChange(val){
        let res
        if(val === '所有'){
          res = await this.$store.dispatch('GET_USERS',`?pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
        }else {
          res = await this.$store.dispatch('GET_USERS',`?role=${val}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
        }
        this.table = res.data
      },
      async handleSizeChange(val) {
        this.pageSize = val
        let res = await this.$store.dispatch('GET_USERS',`?pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
        this.table = res.data
      },
      async handleCurrentChange(val) {
        this.pageIndex = val
        let res = await this.$store.dispatch('GET_USERS',`?pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
        this.table = res.data
      },
      checkRow(row) {
        this.dialog = row
        this.dialogTableVisible = true

      },
      deleteRow(index, rows) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          //先删数据库
          let res = await this.$store.dispatch('DEL_USER',rows[index].username)
          if(res.success){
            rows.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }else {
            throw res.message
          }
        }).catch((e) => {
          this.$message({
            type: 'info',
            message: e.message ? e.message : e
          });
        });
      },
      editRow(id){
        this.$router.push(`/admin/users/editor?id=${id}`)
      }
    },
    async asyncData({store}){
      let res = await store.dispatch('GET_USERS','')
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
        select: '',
        options: ['所有','超级管理员','管理员','用户'],
        dialog: {},
        dialogTableVisible: false
      }
    }
  }
</script>
