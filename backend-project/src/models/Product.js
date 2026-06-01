import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
    productCode: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        validate: {
            notEmpty: true
        }
    },
    productName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    quantityInStock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    supplierName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    dateReceived: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'products',
    timestamps: true
});

export default Product;