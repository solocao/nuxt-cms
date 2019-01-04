<template>
  <div class="c-top">
    <div class="grid-container">
      <div class="grid-x flex-center-c container">
        <div class="cell shrink flex-row">
          <div class="logo"></div>
          <div class="slogan">Jack of all trades and master of none.</div>
        </div>
        <div class="cell auto">
          <div class="login float-r">
            <div v-if="$store.state.user.name">
              <nuxt-link v-if="$store.state.user.role === '超级管理员'" to="/admin">{{$store.state.user.name}}</nuxt-link>
              <nuxt-link v-else to="/user">{{$store.state.user.name}}</nuxt-link>
              <a href="javascript:void(0)" @click="$store.dispatch('LOGOUT')">退出</a>
            </div>
            <div v-else>
              <nuxt-link to="/sign-up">注册</nuxt-link>
              <nuxt-link to="/sign-in">登录</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
