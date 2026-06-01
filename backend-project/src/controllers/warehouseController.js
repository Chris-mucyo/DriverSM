import { Warehouse } from '../models/associations.js';

export const getAllWarehouses = async (req, res) => {
    try {
        const warehouses = await Warehouse.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json({
            success: true,
            data: warehouses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getWarehouseByCode = async (req, res) => {
    try {
        const warehouse = await Warehouse.findByPk(req.params.code);
        if (!warehouse) {
            return res.status(404).json({
                success: false,
                message: 'Warehouse not found'
            });
        }
        res.json({
            success: true,
            data: warehouse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createWarehouse = async (req, res) => {
    try {
        const { warehouseCode, warehouseName, warehouseLocation } = req.body;

        const existingWarehouse = await Warehouse.findByPk(warehouseCode);
        if (existingWarehouse) {
            return res.status(400).json({
                success: false,
                message: 'Warehouse code already exists'
            });
        }

        const warehouse = await Warehouse.create({
            warehouseCode,
            warehouseName,
            warehouseLocation
        });

        res.status(201).json({
            success: true,
            message: 'Warehouse created successfully',
            data: warehouse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateWarehouse = async (req, res) => {
    try {
        const warehouse = await Warehouse.findByPk(req.params.code);
        if (!warehouse) {
            return res.status(404).json({
                success: false,
                message: 'Warehouse not found'
            });
        }

        await warehouse.update(req.body);

        res.json({
            success: true,
            message: 'Warehouse updated successfully',
            data: warehouse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteWarehouse = async (req, res) => {
    try {
        const warehouse = await Warehouse.findByPk(req.params.code);
        if (!warehouse) {
            return res.status(404).json({
                success: false,
                message: 'Warehouse not found'
            });
        }

        await warehouse.destroy();

        res.json({
            success: true,
            message: 'Warehouse deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};