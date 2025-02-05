<template>
    <el-container>
        <el-main>
            <el-card v-if="article" class="box-card">
                <h1>{{ article.title }}</h1>
                <p>{{ article.preview }}</p>
            </el-card>
            <div v-else class="no-data">文章不存在</div>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { onMounted, ref} from 'vue';
import axios from '../axios/axios';
import {useRoute} from 'vue-router';  

interface Article {
    _id: string;
    title: string;
    preview:string;
    createBy: string;
}

const router = useRoute();
const article = ref<Article | null>(null);

const fetchArticles = async() => {
    const {id} = router.params;
    try {
        const res = await axios.get<Article>(`/articles/${id}`);
            article.value = res.data
    }catch (error) {
        console.error(error);
    }
}

onMounted(fetchArticles)
</script>

<style scoped>
.box-card {
    margin: 20px 0;
}
.no-data {
  text-align: center;
  font-size: 1.2em;
  color: #999;
}
</style>