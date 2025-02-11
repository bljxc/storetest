import express from 'express';
import sql from 'mssql';
import cors from 'cors'
import authRoutes from './routes/auth';
import articleRoutes from './routes/article';
import exchangeRateRoutes from './routes/exchangeRate';
import { createArticleTable } from './models/article';
import { createUserTable } from './models/user';
import { createExchangeRateTable } from './models/exchangeRate';

const app = express();

app.use(express.json());
app.use(cors());

// SQL Server 配置
const config = {
  user: 'vueMyTestStore',
  password: '1234',
  server: 'localhost',
  database: 'currencyeg',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/exchangeRates', exchangeRateRoutes); 

const startServer = async () => {
  try {
    // 连接到 SQL Server
    await sql.connect(config);
    console.log('Connected to SQL Server');

    // 初始化数据库表
    await createUserTable();
    await createArticleTable();
    await createExchangeRateTable();
    console.log('Database tables initialized');

    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
