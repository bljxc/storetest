<template>
    <div class="common-layout">
        <el-container>
            <el-main>
                <div v-if="articles && articles.length">
                <el-card v-for="article in articles" :key="article._id" class="article-card">
                  <h2>{{article.title}}</h2>
                  <P>{{article.preview}}</P>
                  <el-button text>阅读更多</el-button>  
                </el-card>
            </div>
            <div v-else class="no-data">no data</div>
            </el-main>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from '../axios/axios';
 

interface Article {
    _id: string;
    title: string;
    preview:string;
    createBy: string;
}

const articles = ref<Article[]>([]);

const fetchArticles = async()=>{
    try{
        const res = await axios.get<Article[]>('/articles')
            articles.value= res.data
    }catch(err){
        console.error('error',err)
    }
}

onMounted(fetchArticles)
</script>

<style scoped>
.article-card {
  margin: 20px 0;
}

.no-data {
  text-align: center;
  font-size: 1.2em;
  color: #999;
}</style>