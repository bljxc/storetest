<template>
  <el-container>
      <el-header>
<el-menu
  :default-active="activeIndex"
  class="el-menu-demo"
  mode="horizontal"
  :ellipsis="false"
  @select="handleSelect"
>
 <el-menu-item index="home">首页</el-menu-item>
      <el-menu-item index="currencyExchange">兑换货币</el-menu-item>
      <el-menu-item index="news">查看新闻</el-menu-item>
      <el-menu-item index="login">登录</el-menu-item>
      <el-menu-item index="register">注册</el-menu-item>
      <el-menu-item index="logout">退出</el-menu-item>
</el-menu>
</el-header>
  <el-main>
      </el-main>
</el-container>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import {useRouter , useRoute , } from 'vue-router'

const router = useRouter();
const route = useRoute();

const activeIndex = ref(route.name?.toString() || 'home')

watch(route, (newRoute) => {
  activeIndex.value = newRoute.name?.toString() || 'home'
})
const handleSelect = (key: string, keyPath: string[]) => {
console.log(key, keyPath)
}
</script>
<style scoped>
</style>