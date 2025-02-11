// server/src/controllers/exchangeRateController.ts
import { Request, Response } from 'express';
import { ExchangeRate, IExchangeRate } from '../models/exchangeRate';

export const getExchangeRates = async (req: Request, res: Response) => {
  try {
    const rates = await ExchangeRate.findAll();
    res.json(rates);
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    res.status(500).json({ message: 'Error fetching exchange rates' });
  }
};

export const createExchangeRate = async (req: Request, res: Response) => {
  try {
    const { fromCurrency, toCurrency, rate } = req.body;

    // 检查是否已存在相同货币对
    const existingRate = await ExchangeRate.findByPair(fromCurrency, toCurrency);
    if (existingRate) {
      return res.status(400).json({ message: 'Exchange rate for this currency pair already exists' });
    }

    const exchangeRateData: IExchangeRate = {
      fromCurrency,
      toCurrency,
      rate
    };

    const newRate = await ExchangeRate.create(exchangeRateData);
    res.json(newRate);
  } catch (error) {
    console.error('Error creating exchange rate:', error);
    res.status(500).json({ message: 'Error creating exchange rate' });
  }
};
