import sql from 'mssql';

export interface IUser {
  id?: number;
  username: string;
  password: string;
}

// 创建用户表
export const createUserTable = async () => {
  try {
    await sql.query`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' and xtype='U')
      CREATE TABLE users (
        id INT PRIMARY KEY IDENTITY(1,1),
        username NVARCHAR(255) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL
      )
    `;
  } catch (error) {
    console.error('Error creating users table:', error);
    throw error;
  }
};

// 用户相关的数据库操作
export const User = {
  async findByUsername(username: string) {
    const result = await sql.query`
      SELECT * FROM users WHERE username = ${username}
    `;
    return result.recordset[0];
  },

  async create(user: IUser) {
    const result = await sql.query`
      INSERT INTO users (username, password)
      OUTPUT INSERTED.*
      VALUES (${user.username}, ${user.password})
    `;
    return result.recordset[0];
  }
};
