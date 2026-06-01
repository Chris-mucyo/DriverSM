import { StockTransaction, Product, Warehouse } from '../models/associations.js';
import sequelize from '../config/database.js';

export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await StockTransaction.findAll({
            include: [
                { model: Product, as: 'product' },
                { model: Warehouse, as: 'warehouse' }
            ],
            order: [['transactionDate', 'DESC']]
        });
        res.json({
            success: true,
            data: transactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getTransactionById = async (req, res) => {
    try {
        const transaction = await StockTransaction.findByPk(req.params.id, {
            include: [
                { model: Product, as: 'product' },
                { model: Warehouse, as: 'warehouse' }
            ]
        });
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }
        res.json({
            success: true,
            data: transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createTransaction = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { productCode, warehouseCode, quantityMoved, transactionType, transactionDate } = req.body;

        // Validate product exists
        const product = await Product.findByPk(productCode);
        if (!product) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Validate warehouse exists
        const warehouse = await Warehouse.findByPk(warehouseCode);
        if (!warehouse) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Warehouse not found'
            });
        }

        // Update stock quantity based on transaction type
        if (transactionType === 'IN') {
            product.quantityInStock += quantityMoved;
        } else if (transactionType === 'OUT') {
            if (product.quantityInStock < quantityMoved) {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: 'Insufficient stock'
                });
            }
            product.quantityInStock -= quantityMoved;
        }

        await product.save({ transaction });

        const newTransaction = await StockTransaction.create({
            productCode,
            warehouseCode,
            quantityMoved,
            transactionType,
            transactionDate: transactionDate || new Date()
        }, { transaction });

        await transaction.commit();

        res.status(201).json({
            success: true,
            message: 'Transaction created successfully',
            data: newTransaction
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateTransaction = async (req, res) => {
    const dbTransaction = await sequelize.transaction();

    try {
        const transaction = await StockTransaction.findByPk(req.params.id);
        if (!transaction) {
            await dbTransaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        // Reverse old transaction effect
        const product = await Product.findByPk(transaction.productCode);
        if (transaction.transactionType === 'IN') {
            product.quantityInStock -= transaction.quantityMoved;
        } else {
            product.quantityInStock += transaction.quantityMoved;
        }

        // Apply new transaction effect
        const { quantityMoved, transactionType } = req.body;
        if (transactionType === 'IN') {
            product.quantityInStock += quantityMoved;
        } else {
            if (product.quantityInStock < quantityMoved) {
                await dbTransaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: 'Insufficient stock'
                });
            }
            product.quantityInStock -= quantityMoved;
        }

        await product.save({ transaction: dbTransaction });
        await transaction.update(req.body, { transaction: dbTransaction });

        await dbTransaction.commit();

        res.json({
            success: true,
            message: 'Transaction updated successfully',
            data: transaction
        });
    } catch (error) {
        await dbTransaction.rollback();
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteTransaction = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const stockTransaction = await StockTransaction.findByPk(req.params.id);
        if (!stockTransaction) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        // Reverse transaction effect on stock
        const product = await Product.findByPk(stockTransaction.productCode);
        if (stockTransaction.transactionType === 'IN') {
            product.quantityInStock -= stockTransaction.quantityMoved;
        } else {
            product.quantityInStock += stockTransaction.quantityMoved;
        }

        await product.save({ transaction });
        await stockTransaction.destroy({ transaction });

        await transaction.commit();

        res.json({
            success: true,
            message: 'Transaction deleted successfully'
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};