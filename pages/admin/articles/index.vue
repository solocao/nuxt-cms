<template>
  <div class="admin-list">
    <div class="flex-row-sb">
      <el-button type="success" @click="postArticle">{{ $t('admin.page.article.publish') }}</el-button>
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
          prop="title"
          label="标题"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          width="100"
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
      <div class="ql-container ql-snow">
        <div class="ql-editor">
          <div class="article-detail">
            <div class="title">{{dialog.title}}</div>
            <div class="info">{{dialog.createdAt}}</div>
            <hr>
            <div class="content" v-html="dialog.content"></div>
          </div>
        </div>
      </div>
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
        if(val === '全部'){
          res = await this.$store.dispatch('article/GET_ARTICLES',`?pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
        }else {
          res = await this.$store.dispatch('article/GET_ARTICLES',`?type=${val}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
        }
        this.table = res.data
      },
      async handleSizeChange(val) {
        this.pageSize = val
        let res = await this.$store.dispatch('article/GET_ARTICLES',`?pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
        this.table = res.data
      },
      async handleCurrentChange(val) {
        this.pageIndex = val
        let res = await this.$store.dispatch('article/GET_ARTICLES',`?pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
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
          let res = await this.$store.dispatch('article/DEL_ARTICLE',rows[index].id)
          if(res.success){
            rows.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }else {
            this.$message({
              type: 'error',
              message: res.message
            });
          }
        })
      },
      editRow(id){
        this.$router.push(`/admin/articles/editor?id=${id}`)
      }
    },
    async asyncData({store}){
      let res = await store.dispatch('article/GET_ARTICLES','')
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
        options: ['全部','期刊','日志'],
        dialog: {},
        dialogTableVisible: false
      }
    }
  }
</script>
