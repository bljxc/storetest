// server/src/models/ExchangeRate.ts
import sql from 'mssql';

export interface IExchangeRate {
  id?: number;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
}

// 创建汇率表
export const createExchangeRateTable = async () => {
  try {
    await sql.query`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='exchange_rates' and xtype='U')
      CREATE TABLE exchange_rates (
        id INT PRIMARY KEY IDENTITY(1,1),
        fromCurrency NVARCHAR(10) NOT NULL,
        toCurrency NVARCHAR(10) NOT NULL,
        rate DECIMAL(18, 6) NOT NULL,
        CONSTRAINT UC_Currency_Pair UNIQUE (fromCurrency, toCurrency)
      )
    `;
  } catch (error) {
    console.error('Error creating exchange_rates table:', error);
    throw error;
  }
};

// 汇率相关的数据库操作
export const ExchangeRate = {
  async findAll() {
    const result = await sql.query`SELECT * FROM exchange_rates`;
    return result.recordset;
  },

  async create(exchangeRate: IExchangeRate) {
    const result = await sql.query`
      INSERT INTO exchange_rates (fromCurrency, toCurrency, rate)
      OUTPUT INSERTED.*
      VALUES (${exchangeRate.fromCurrency}, ${exchangeRate.toCurrency}, ${exchangeRate.rate})
    `;
    return result.recordset[0];
  },

  async findByPair(fromCurrency: string, toCurrency: string) {
    const result = await sql.query`
      SELECT * FROM exchange_rates 
      WHERE fromCurrency = ${fromCurrency} AND toCurrency = ${toCurrency}
    `;
    return result.recordset[0];
  }
};
