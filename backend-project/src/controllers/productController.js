import { Product } from '../models/associations.js';

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getProductByCode = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.code);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { productCode, productName, category, quantityInStock, unitPrice, supplierName, dateReceived } = req.body;

        const existingProduct = await Product.findByPk(productCode);
        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: 'Product code already exists'
            });
        }

        const product = await Product.create({
            productCode,
            productName,
            category,
            quantityInStock: quantityInStock || 0,
            unitPrice,
            supplierName,
            dateReceived
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.code);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await product.update(req.body);

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.code);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await product.destroy();

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};