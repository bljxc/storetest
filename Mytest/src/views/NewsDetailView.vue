<template>
    <el-container>
        <el-main>
            <el-card v-if="article" class="box-card">
                <div class="article-header">
                    <h1>{{ article.title }}</h1>
                    <div class="article-meta">
                        <span>作者：{{ article.createBy }}</span>
                        <span>发布时间：{{ formatDate(article.createdAt) }}</span>
                    </div>
                </div>
                <div class="article-content">
                    <p>{{ article.preview }}</p>
                </div>
                <div class="article-actions">
                    <el-button type="primary" @click="handleLike" :disabled="hasLiked">
                        👍 {{ article.likes || 0 }} 点赞
                    </el-button>
                </div>
                
                <!-- 评论区 -->
                <div class="comments-section">
                    <h3>评论区</h3>
                    <div class="comment-form">
                        <el-input
                            v-model="newComment"
                            type="textarea"
                            :rows="3"
                            placeholder="写下你的评论..."
                        />
                        <el-button type="primary" @click="submitComment" :disabled="!newComment.trim()">
                            发表评论
                        </el-button>
                    </div>
                    
                    <!-- 评论列表 -->
                    <div class="comments-list">
                        <el-empty v-if="!comments.length" description="暂无评论" />
                        <div v-else v-for="comment in comments" :key="comment._id" class="comment-item">
                            <div class="comment-header">
                                <span class="comment-author">{{ comment.author }}</span>
                                <span class="comment-time">{{ formatDate(comment.createdAt) }}</span>
                            </div>
                            <div class="comment-content">{{ comment.content }}</div>
                        </div>
                    </div>
                </div>
            </el-card>
            <div v-else class="no-data">文章不存在</div>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from '../axios/axios';
import { useRoute } from 'vue-router';
import { useauthStore } from '../store/auth';
import { ElMessage } from 'element-plus';

interface Article {
    _id: string;
    title: string;
    preview: string;
    createBy: string;
    createdAt: string;
    likes: number;
}

interface Comment {
    _id: string;
    author: string;
    content: string;
    createdAt: string;
    articleId: string;
}

const route = useRoute();
const authStore = useauthStore();
const article = ref<Article | null>(null);
const comments = ref<Comment[]>([]);
const newComment = ref('');
const hasLiked = ref(false);

// 格式化日期
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
};

// 获取文章详情
const fetchArticle = async () => {
    const { id } = route.params;
    try {
        const res = await axios.get<Article>(`/articles/${id}`);
        article.value = res.data;
        // 检查用户是否已点赞
        checkUserLike();
    } catch (error) {
        console.error(error);
        ElMessage.error('获取文章失败');
    }
};

// 获取评论列表
const fetchComments = async () => {
    const { id } = route.params;
    try {
        const res = await axios.get<Comment[]>(`/articles/${id}/comments`);
        comments.value = res.data;
    } catch (error) {
        console.error(error);
        ElMessage.error('获取评论失败');
    }
};

// 提交评论
const submitComment = async () => {
    if (!authStore.isAuthenticated) {
        ElMessage.error('请先登录');
        return;
    }

    try {
        const { id } = route.params;
        await axios.post(`/articles/${id}/comments`, {
            content: newComment.value
        });
        ElMessage.success('评论成功');
        newComment.value = '';
        fetchComments();
    } catch (error) {
        console.error(error);
        ElMessage.error('评论失败');
    }
};

// 处理点赞
const handleLike = async () => {
    if (!authStore.isAuthenticated) {
        ElMessage.error('请先登录');
        return;
    }

    try {
        const { id } = route.params;
        await axios.post(`/articles/${id}/like`);
        if (article.value) {
            article.value.likes = (article.value.likes || 0) + 1;
        }
        hasLiked.value = true;
        ElMessage.success('点赞成功');
    } catch (error) {
        console.error(error);
        ElMessage.error('点赞失败');
    }
};

// 检查用户是否已点赞
const checkUserLike = async () => {
    if (!authStore.isAuthenticated) return;
    
    try {
        const { id } = route.params;
        const res = await axios.get(`/articles/${id}/like/check`);
        hasLiked.value = res.data.hasLiked;
    } catch (error) {
        console.error(error);
    }
};

onMounted(() => {
    fetchArticle();
    fetchComments();
});
</script>

<style scoped>
.box-card {
    margin: 20px 0;
}

.article-header {
    margin-bottom: 20px;
}

.article-meta {
    color: #666;
    font-size: 0.9em;
    margin: 10px 0;
}

.article-meta span {
    margin-right: 20px;
}

.article-content {
    margin: 20px 0;
    line-height: 1.6;
}

.article-actions {
    margin: 20px 0;
    padding: 10px 0;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
}

.comments-section {
    margin-top: 30px;
}

.comment-form {
    margin: 20px 0;
}

.comment-form .el-button {
    margin-top: 10px;
}

.comments-list {
    margin-top: 20px;
}

.comment-item {
    padding: 15px 0;
    border-bottom: 1px solid #eee;
}

.comment-header {
    margin-bottom: 8px;
}

.comment-author {
    font-weight: bold;
    margin-right: 10px;
}

.comment-time {
    color: #999;
    font-size: 0.9em;
}

.comment-content {
    line-height: 1.5;
}

.no-data {
    text-align: center;
    font-size: 1.2em;
    color: #999;
}
</style>