import { Request, Response } from 'express';
import { Article, IArticle } from '../models/article';

interface AuthRequest extends Request {
  userId?: string;
}

export const getArticles = async (req: Request, res: Response) => {
  try {
    const articles = await Article.findAll();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching articles', error });
  }
};

export const getArticle = async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(Number(req.params.id));
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching article', error });
  }
};

export const createArticle = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, preview } = req.body;
    const articleData: IArticle = {
      title,
      content,
      preview,
      createdBy: req.userId || 'anonymous'
    };
    const article = await Article.create(articleData);
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Error creating article', error });
  }
};

export const deleteArticle = async (req: AuthRequest, res: Response) => {
  try {
    const article = await Article.delete(Number(req.params.id));
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting article', error });
  }
};

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const comment = await Article.addComment({
      articleId: Number(id),
      userId: Number(userId),
      content
    });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const comments = await Article.getComments(Number(id));
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error });
  }
};

export const likeArticle = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await Article.addLike({
      articleId: Number(id),
      userId: Number(userId)
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error liking article', error });
  }
};

export const checkLike = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const hasLiked = await Article.checkUserLike(Number(id), Number(userId));
    res.json({ hasLiked });
  } catch (error) {
    res.status(500).json({ message: 'Error checking like', error });
  }
};