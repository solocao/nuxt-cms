<template>
  <div class="a-aside">
    <el-menu :default-active="$store.state.route" active-text-color="#ff5543" :router="true" class="el-menu-vertical-demo" :collapse="$store.state.admin.isMenuCollapse">
      <el-menu-item index="/">
        <i class="el-icon-back"></i>
        <span slot="title">{{ $t('admin.home') }}</span>
      </el-menu-item>
      <el-menu-item index="/admin">
        <i class="el-icon-setting"></i>
        <span slot="title">{{ $t('admin.dashboard') }}</span>
      </el-menu-item>
      <el-menu-item index="/admin/users">
        <i class="el-icon-menu"></i>
        <span slot="title">{{ $t('admin.userManagement') }}</span>
      </el-menu-item>
      <el-menu-item index="/admin/logos">
        <i class="el-icon-menu"></i>
        <span slot="title">{{ $t('admin.logoManagement') }}</span>
      </el-menu-item>
      <el-menu-item index="/admin/articles">
        <i class="el-icon-menu"></i>
        <span slot="title">{{ $t('admin.articleManagement') }}</span>
      </el-menu-item>
      <el-menu-item index="/admin/contact">
        <i class="el-icon-menu"></i>
        <span slot="title">{{ $t('admin.contactManagement') }}</span>
      </el-menu-item>
      <div class="button-container">
        <div v-show="!$store.state.admin.isMenuCollapse"><el-button @click="$store.dispatch('LOGOUT')">{{ $t('admin.logout') }}</el-button></div>
      </div>
    </el-menu>
  </div>
</template>
