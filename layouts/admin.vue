<template>
  <div class="admin-layout">
    <div class="hide-for-small-only">
      <el-container>
        <el-aside width="200px">
          <a-aside/>
        </el-aside>
        <el-container>
          <el-header>
            <a-header></a-header>
          </el-header>
          <el-main>
            <nuxt/>
          </el-main>
        </el-container>
      </el-container>
    </div>
    <div class="show-for-small-only flex-center-c">
      <div style="font-size: 20px;font-weight: 100;">后台管理界面请登录PC端查看</div>
    </div>
  </div>
</template>
