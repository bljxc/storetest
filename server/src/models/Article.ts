import sql from 'mssql';

export interface IArticle {
  id?: number;
  title: string;
  content: string;
  preview: string;
  createdBy: string;
}
export interface IComment {
  id?: number;
  articleId: number;
  userId: number;
  content: string;
  createdAt?: Date;
}
export interface ILike {
  id?: number;
  articleId: number;
  userId: number;
  createdAt?: Date;
}

// 创建文章表的 SQL 语句
export const createArticleTable = async () => {
  try {
    await sql.query`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='articles' and xtype='U')
      CREATE TABLE articles (
        id INT PRIMARY KEY IDENTITY(1,1),
        title NVARCHAR(255) NOT NULL,
        content NTEXT NOT NULL,
        preview NVARCHAR(MAX) NOT NULL,
        createdBy NVARCHAR(255) NOT NULL
      )
    `;

    await sql.query`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='comments' and xtype='U')
      CREATE TABLE comments (
        id INT PRIMARY KEY IDENTITY(1,1),
        articleId INT NOT NULL,
        userId INT NOT NULL,
        content NVARCHAR(MAX) NOT NULL,
        createdAt DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (articleId) REFERENCES articles(id)
      )
    `;

    await sql.query`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='likes' and xtype='U')
      CREATE TABLE likes (
        id INT PRIMARY KEY IDENTITY(1,1),
        articleId INT NOT NULL,
        userId INT NOT NULL,
        createdAt DATETIME DEFAULT GETDATE(),
        UNIQUE (articleId, userId),
        FOREIGN KEY (articleId) REFERENCES articles(id)
      )
    `;
  } catch (error) {
    console.error('Error creating articles table:', error);
    throw error;
  }
};

// 文章相关的数据库操作
export const Article = {
  async findAll() {
    const result = await sql.query`
      SELECT 
        a.*,
        (SELECT COUNT(*) FROM likes WHERE articleId = a.id) AS likes
      FROM articles a
    `;
    return result.recordset;
  },

  async findById(id: number) {
    const result = await sql.query`
      SELECT 
        a.*,
        (SELECT COUNT(*) FROM likes WHERE articleId = a.id) AS likes
      FROM articles a
      WHERE id = ${id}
    `;
    return result.recordset[0];
  },

  async create(article: IArticle) {
    const result = await sql.query`
      INSERT INTO articles (title, content, preview, createdBy)
      OUTPUT INSERTED.*
      VALUES (${article.title}, ${article.content}, ${article.preview}, ${article.createdBy})
    `;
    return result.recordset[0];
  },

  async delete(id: number) {
    const result = await sql.query`
      DELETE FROM articles
      OUTPUT DELETED.*
      WHERE id = ${id}
    `;
    return result.recordset[0];
  },

  async addComment(comment: IComment) {
    const result = await sql.query`
      INSERT INTO comments (articleId, userId, content)
      OUTPUT INSERTED.*
      VALUES (${comment.articleId}, ${comment.userId}, ${comment.content})
    `;
    return result.recordset[0];
  },

  async getComments(articleId: number) {
    const result = await sql.query`
      SELECT 
        c.*,
        u.username AS author
      FROM comments c
      JOIN users u ON c.userId = u.id
      WHERE articleId = ${articleId}
      ORDER BY c.createdAt DESC
    `;
    return result.recordset;
  },

  async addLike(like: ILike) {
    await sql.query`
      BEGIN TRANSACTION;
      INSERT INTO likes (articleId, userId)
      VALUES (${like.articleId}, ${like.userId});
      UPDATE articles SET likes = likes + 1 WHERE id = ${like.articleId};
      COMMIT;
    `;
  },

  async checkUserLike(articleId: number, userId: number) {
    const result = await sql.query`
      SELECT 1 AS hasLiked
      FROM likes
      WHERE articleId = ${articleId} AND userId = ${userId}
    `;
    return result.recordset[0]?.hasLiked === 1;
  }
};