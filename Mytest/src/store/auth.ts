import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

export const useAuthStore = defineStore('auth', ()=>{
    const token = ref<string | null>(localStorage.getItem('token'))

    const login = async(username:string,password:string) => {
       try{
        // 发送登录请求
        const res =await axios.post('/auth/login', {
            username,
            password
          })
          token.value = res.data.token;
          localStorage.setItem('token', token.value || '');
          console.log(res);
       }catch(error){
        console.error(error, '登录失败');
        router.push({
            name: 'Login'
          })
       }
        
      
    
      
    }
    
    const register = async(username:string,password:string) => {
        try{
             // 发送登录请求
        const res =await axios.post('/auth/register', {
            username,
            password
          })
          token.value = res.data.token;
          localStorage.setItem('token', token.value || '');
          console.log(res);
        }catch(error){
            console.error(error, '注册失败');
        }
       
    }

    //退出登录
    const logout = () => {
        token.value = null;
        localStorage.removeItem('token')
    }

    return {
        token,
        login,
        register,
        logout
    }
})