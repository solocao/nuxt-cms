<template>
  <div class="admin-list">
    <div class="table-container">
      <el-table
        :data="table"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="姓名"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="电话"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="message"
          label="信息"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          sortable
          prop="createdAt"
          label="日期"
          width="130"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="170">
          <template slot-scope="scope">
            <el-button @click="checkRow(scope.row)" type="text" size="small">{{ $t('admin.page.check') }}</el-button>
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
      <div class="title">姓名：{{dialog.name}}</div>
      <div class="title">电话：{{dialog.phone}}</div>
      <div class="title">信息：{{dialog.message}}</div>
      <div class="title">日期：{{dialog.createdAt | formatDate}}</div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    layout: 'admin',
    middleware: 'auth',
    methods: {
      async handleSizeChange(val) {
        this.pageSize = val
        let res = await this.$store.dispatch('contact/GET_CONTACTS',`?pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
        this.table = res.data
      },
      async handleCurrentChange(val) {
        this.pageIndex = val
        let res = await this.$store.dispatch('contact/GET_CONTACTS',`?pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
        this.table = res.data
      },
      checkRow(row) {
        this.dialog = row
        this.dialogTableVisible = true
      }
    },
    async asyncData({store}){
      let res = await store.dispatch('contact/GET_CONTACTS','')
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
