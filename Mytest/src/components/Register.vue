<template>
    <el-container>
        <el-main >
            <div class="auth-container" @submit.prevent="register">
            <el-form :model="form" class="auth-form">
    <el-form-item label="用户名" label-width="80px">
      <el-input v-model="form.username" type="text" placeholder="请输入用户名" />
    </el-form-item>
    <el-form-item label="密码" label-width="80px">
      <el-input v-model="form.password" type="password" placeholder="请输入密码"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit">注册</el-button>
    </el-form-item>
  </el-form>
</div>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import { useRouter } from 'vue-router';
import {useauthStore} from '../store/auth';
import { ElMessage } from 'element-plus';

const form = ref({
  username: '',
  password: ''
})

const router = useRouter();
const authStore = useauthStore();

const register= async()=>{
  try{
    await authStore.register(form.value.username,form.value.password);
    router.push({
      name: 'News'
    })
  }catch{
    ElMessage.error('请检查用户名和密码')
  }
}

</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
  box-sizing: border-box;
}

.auth-form {
  width: 100%;
  max-width: 360px;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>