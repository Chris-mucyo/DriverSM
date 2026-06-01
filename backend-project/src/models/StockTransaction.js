import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const StockTransaction = sequelize.define('StockTransaction', {
    transactionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    transactionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    quantityMoved: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    transactionType: {
        type: DataTypes.ENUM('IN', 'OUT'),
        allowNull: false
    },
    productCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
            model: 'products',
            key: 'productCode'
        }
    },
    warehouseCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
            model: 'warehouses',
            key: 'warehouseCode'
        }
    }
}, {
    tableName: 'stock_transactions',
    timestamps: true
});

export default StockTransaction;