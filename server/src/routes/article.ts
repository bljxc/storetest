import { Router } from 'express';
import { getArticles, getArticle, createArticle, deleteArticle, addComment, getComments, likeArticle, checkLike } from '../controllers/articleController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getArticles);
router.get('/:id', getArticle);
router.post('/', authMiddleware, createArticle);
router.delete('/:id', authMiddleware, deleteArticle);

// 评论相关路由
router.post('/:id/comments', authMiddleware, addComment);  // 添加评论
router.get('/:id/comments', getComments);  // 获取评论列表

// 点赞相关路由
router.post('/:id/like', authMiddleware, likeArticle);  // 点赞文章
router.get('/:id/like/check', authMiddleware, checkLike);  // 检查用户是否点赞
export default router;
