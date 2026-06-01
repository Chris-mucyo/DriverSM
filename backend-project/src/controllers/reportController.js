import { StockTransaction, Product } from '../models/associations.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';

export const getDailyReport = async (req, res) => {
    try {
        const { date } = req.query;
        const reportDate = date || new Date().toISOString().split('T')[0];

        const startDate = new Date(reportDate);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(reportDate);
        endDate.setHours(23, 59, 59, 999);

        const transactions = await StockTransaction.findAll({
            where: {
                transactionDate: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: ['product', 'warehouse']
        });

        const stockIn = transactions
            .filter(t => t.transactionType === 'IN')
            .reduce((sum, t) => sum + t.quantityMoved, 0);

        const stockOut = transactions
            .filter(t => t.transactionType === 'OUT')
            .reduce((sum, t) => sum + t.quantityMoved, 0);

        const products = await Product.findAll();
        const availableStock = products.reduce((sum, p) => sum + p.quantityInStock, 0);

        res.json({
            success: true,
            data: {
                date: reportDate,
                transactions,
                summary: {
                    stockIn,
                    stockOut,
                    availableStock,
                    totalTransactions: transactions.length
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getWeeklyReport = async (req, res) => {
    try {
        const { week } = req.query;
        const currentDate = new Date();
        const weekNumber = week || currentDate.getWeek();

        const startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - currentDate.getDay());
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);

        const transactions = await StockTransaction.findAll({
            where: {
                transactionDate: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: ['product', 'warehouse']
        });

        const dailyStats = {};
        for (let i = 0; i <= 6; i++) {
            const day = new Date(startDate);
            day.setDate(startDate.getDate() + i);
            const dateStr = day.toISOString().split('T')[0];
            dailyStats[dateStr] = { stockIn: 0, stockOut: 0, transactions: [] };
        }

        transactions.forEach(transaction => {
            const dateStr = transaction.transactionDate.toISOString().split('T')[0];
            if (dailyStats[dateStr]) {
                if (transaction.transactionType === 'IN') {
                    dailyStats[dateStr].stockIn += transaction.quantityMoved;
                } else {
                    dailyStats[dateStr].stockOut += transaction.quantityMoved;
                }
                dailyStats[dateStr].transactions.push(transaction);
            }
        });

        res.json({
            success: true,
            data: {
                week: weekNumber,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                dailyStats,
                totalStockIn: Object.values(dailyStats).reduce((sum, day) => sum + day.stockIn, 0),
                totalStockOut: Object.values(dailyStats).reduce((sum, day) => sum + day.stockOut, 0)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getMonthlyReport = async (req, res) => {
    try {
        const { month, year } = req.query;
        const currentDate = new Date();
        const reportMonth = month || currentDate.getMonth() + 1;
        const reportYear = year || currentDate.getFullYear();

        const startDate = new Date(reportYear, reportMonth - 1, 1);
        const endDate = new Date(reportYear, reportMonth, 0, 23, 59, 59, 999);

        const transactions = await StockTransaction.findAll({
            where: {
                transactionDate: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: ['product', 'warehouse']
        });

        const stockInByProduct = {};
        const stockOutByProduct = {};

        transactions.forEach(transaction => {
            const productCode = transaction.productCode;
            if (transaction.transactionType === 'IN') {
                stockInByProduct[productCode] = (stockInByProduct[productCode] || 0) + transaction.quantityMoved;
            } else {
                stockOutByProduct[productCode] = (stockOutByProduct[productCode] || 0) + transaction.quantityMoved;
            }
        });

        const products = await Product.findAll();
        const availableStock = products.reduce((sum, p) => sum + p.quantityInStock, 0);

        res.json({
            success: true,
            data: {
                month: reportMonth,
                year: reportYear,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                transactions,
                summary: {
                    totalStockIn: Object.values(stockInByProduct).reduce((sum, qty) => sum + qty, 0),
                    totalStockOut: Object.values(stockOutByProduct).reduce((sum, qty) => sum + qty, 0),
                    availableStock,
                    totalTransactions: transactions.length
                },
                stockInByProduct,
                stockOutByProduct
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Helper function to get week number
Date.prototype.getWeek = function() {
    const date = new Date(this);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};